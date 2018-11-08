/*
Copyright (c) 2018 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/

// @flow
import * as React from 'react';
import {getOverride, getOverrideProps} from '../helpers/overrides';
import {STYLETRON_PROP_MAPPER} from './constants';
import {
  Label as StyledLabel,
  Caption as StyledCaption,
  ControlContainer as StyledControlContainer,
} from './styled-components';
import type {FormControlPropsT} from './types';

function getSharedProps(props: {}, mapper: {}) {
  return Object.keys(props).reduce((newProps, propName) => {
    const newName = mapper[propName] && `$${propName}`;
    if (newName) {
      newProps[newName] = props[propName];
    }
    return newProps;
  }, {});
}

export default class FormControl extends React.Component<FormControlPropsT> {
  static defaultProps = {
    overrides: {},
    label: null,
    caption: null,
    error: false,
  };

  render() {
    const {
      overrides: {Label: LabelOverride, Caption: CaptionOverride},
      label,
      caption,
      error,
      children,
    } = this.props;

    const onlyChildProps = React.Children.only(children).props;
    const sharedProps = getSharedProps(onlyChildProps, STYLETRON_PROP_MAPPER);
    sharedProps.$error = this.props.error || sharedProps.$error;
    const Label = getOverride(LabelOverride) || StyledLabel;
    const Caption = getOverride(CaptionOverride) || StyledCaption;

    return (
      <React.Fragment>
        {label && (
          <Label
            htmlFor={onlyChildProps.id}
            {...sharedProps}
            {...getOverrideProps(LabelOverride)}
          >
            {typeof label === 'function' ? label(sharedProps) : label}
          </Label>
        )}
        <StyledControlContainer>
          {children}
          {(caption || error) && (
            <Caption {...sharedProps} {...getOverrideProps(CaptionOverride)}>
              {error && typeof error !== 'boolean'
                ? typeof error === 'function'
                  ? error(sharedProps)
                  : error
                : typeof caption === 'function'
                  ? caption(sharedProps)
                  : caption}
            </Caption>
          )}
        </StyledControlContainer>
      </React.Fragment>
    );
  }
}

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { ReactElement, JSXElementConstructor } from 'react';
import {
  StyledLayoutWrapper,
  LeftColumn,
  RightColumn,
  OuterRow,
  PanelRow,
  FooterRow,
  StyledHeader,
  StyledLeftPanel,
  StyledDatasetPanel,
  StyledRightPanel,
  StyledFooter,
} from 'src/views/CRUD/data/dataset/styles';

interface DatasetLayoutProps {
  header?: ReactElement<any, string | JSXElementConstructor<any>> | null;
  leftPanel?: ReactElement<any, string | JSXElementConstructor<any>> | null;
  datasetPanel?: ReactElement<any, string | JSXElementConstructor<any>> | null;
  rightPanel?: ReactElement<any, string | JSXElementConstructor<any>> | null;
  footer?: ReactElement<any, string | JSXElementConstructor<any>> | null;
}

export default function DatasetLayout({
  header,
  leftPanel,
  datasetPanel,
  rightPanel,
  footer,
}: DatasetLayoutProps) {
  return (
    <StyledLayoutWrapper data-test="dataset-layout-wrapper">
      {header && <StyledHeader>{header}</StyledHeader>}
      <OuterRow>
        <LeftColumn>
          {leftPanel && <StyledLeftPanel>{leftPanel}</StyledLeftPanel>}
        </LeftColumn>

        <RightColumn>
          <PanelRow>
            {datasetPanel && (
              <StyledDatasetPanel>{datasetPanel}</StyledDatasetPanel>
            )}
            {rightPanel && <StyledRightPanel>{rightPanel}</StyledRightPanel>}
          </PanelRow>

          <FooterRow>
            {footer && <StyledFooter>{footer}</StyledFooter>}
          </FooterRow>
        </RightColumn>
      </OuterRow>
    </StyledLayoutWrapper>
  );
}

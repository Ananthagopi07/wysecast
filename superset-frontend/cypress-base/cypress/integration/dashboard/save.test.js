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

import shortid from 'shortid';
import {
  waitForChartLoad,
  WORLD_HEALTH_CHARTS,
  WORLD_HEALTH_DASHBOARD,
} from './dashboard.helper';

function openDashboardEditProperties() {
  // open dashboard properties edit modal
  cy.get('.header-with-actions [aria-label="Edit dashboard"]')
    .should('be.visible')
    .click();
  cy.get(
    '.header-with-actions .right-button-panel .ant-dropdown-trigger',
  ).trigger('click', {
    force: true,
  });
  cy.get('[data-test=header-actions-menu]')
    .contains('Edit properties')
    .click({ force: true });
}

describe('Dashboard save action', () => {
  beforeEach(() => {
    cy.login();
    cy.visit(WORLD_HEALTH_DASHBOARD);
    cy.get('#app').then(() => {
      cy.get('.dashboard-header-container').then(headerContainerElement => {
        const dashboardId = headerContainerElement.attr('data-test-id');

        cy.intercept('POST', `/superset/copy_dash/${dashboardId}/`).as(
          'copyRequest',
        );

        cy.get('[aria-label="more-horiz"]').trigger('click', { force: true });
        cy.get('[data-test="save-as-menu-item"]').trigger('click', {
          force: true,
        });
        cy.get('[data-test="modal-save-dashboard-button"]').trigger('click', {
          force: true,
        });
      });
    });
  });

  // change to what the title should be
  it('should save as new dashboard', () => {
    cy.wait('@copyRequest').then(() => {
      cy.get('[data-test="editable-title"]').then(element => {
        const dashboardTitle = element.attr('title');
        expect(dashboardTitle).to.not.equal(`World Bank's Data`);
      });
    });
  });

  it('should save/overwrite dashboard', () => {
    // should load chart
    WORLD_HEALTH_CHARTS.forEach(waitForChartLoad);

    // remove box_plot chart from dashboard
    cy.get('[aria-label="Edit dashboard"]').click({ timeout: 5000 });
    cy.get('[data-test="dashboard-delete-component-button"]')
      .last()
      .trigger('mouseenter')
      .click();

    cy.get('[data-test="grid-container"]')
      .find('.box_plot')
      .should('not.exist');

    cy.intercept('PUT', '/api/v1/dashboard/**').as('putDashboardRequest');
    cy.get('.header-with-actions')
      .find('[data-test="header-save-button"]')
      .contains('Save')
      .click();

    // go back to view mode
    cy.wait('@putDashboardRequest');
    cy.get('.header-with-actions')
      .find('[aria-label="Edit dashboard"]')
      .click();

    // deleted boxplot should still not exist
    cy.get('[data-test="grid-container"]')
      .find('.box_plot', { timeout: 20000 })
      .should('not.exist');
  });

  it('should save after edit', () => {
    cy.get('.dashboard-grid', { timeout: 50000 }) // wait for 50 secs to load dashboard
      .then(() => {
        const dashboardTitle = `Test dashboard [${shortid.generate()}]`;

        openDashboardEditProperties();

        // open color scheme dropdown
        cy.get('.ant-modal-body')
          .contains('Color scheme')
          .parents('.ControlHeader')
          .next('.ant-select')
          .click()
          .then(() => {
            // select a new color scheme
            cy.get('.ant-modal-body')
              .find('.ant-select-item-option-active')
              .first()
              .click();
          });

        // remove json metadata
        cy.get('.ant-modal-body')
          .contains('Advanced')
          .click()
          .then(() => {
            cy.get('#json_metadata').type('{selectall}{backspace}');
          });

        // update title
        cy.get('[data-test="dashboard-title-input"]').type(
          `{selectall}{backspace}${dashboardTitle}`,
        );

        // save edit changes
        cy.get('.ant-modal-footer')
          .contains('Apply')
          .click()
          .then(() => {
            // assert that modal edit window has closed
            cy.get('.ant-modal-body').should('not.exist');

            // save dashboard changes
            cy.get('.header-with-actions').contains('Save').click();

            // assert success flash
            cy.contains('saved successfully').should('be.visible');

            // assert title has been updated
            cy.get(
              '.header-with-actions .title-panel [data-test="editable-title"]',
            ).should('have.text', dashboardTitle);
          });
      });
  });
});

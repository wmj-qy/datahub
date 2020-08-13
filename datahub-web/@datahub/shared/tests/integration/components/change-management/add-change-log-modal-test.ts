import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, fillIn, click, find, triggerKeyEvent } from '@ember/test-helpers';
import { noop } from 'lodash';
import hbs from 'htmlbars-inline-precompile';
import { baseModalClass } from '@datahub/shared/components/change-management/add-change-log-modal';
import { IAddChangeLogModalProps } from '@datahub/shared/types/change-management/change-log';
import { TestContext } from 'ember-test-helpers';

const modalClassSelector = `.${baseModalClass}__modal`;
const subjectClassSelector = `.${baseModalClass}__text-input-subject`;
const contentClassSelector = `.${baseModalClass}__text-input-content`;
const emailClassSelector = `#send-change-log-email`;

module('Integration | Component | change-management/add-change-log-modal', function(hooks): void {
  setupRenderingTest(hooks);

  hooks.beforeEach(function(this: TestContext, assert): void {
    this.setProperties({
      onSave(value: IAddChangeLogModalProps): void {
        assert.ok(value, 'A value was given to the save action');
        assert.equal(Object.keys(value).length, 5, '5 Edited props were passed to the action');
      },
      onCloseModal: noop,
      followers: ['Ciri', 'Dandelion', 'Yennefer', 'Triss']
    });
  });

  test('it renders as expected with the right defaults', async function(assert): Promise<void> {
    await render(hbs`
      <ChangeManagement::AddChangeLogModal
        @onCloseModal={{action this.onCloseModal}}
        @onSave={{action this.onSave}}
      />
    `);

    assert.dom(modalClassSelector).exists();
    assert.dom(subjectClassSelector).hasText('');
    assert.dom(contentClassSelector).hasText('');
    assert.dom(emailClassSelector).isNotChecked();
  });

  test('Saving to log happens as intended', async function(assert): Promise<void> {
    await render(hbs`
      <ChangeManagement::AddChangeLogModal
        @onCloseModal={{action this.onCloseModal}}
        @onSave={{action this.onSave}}
      />s
    `);

    await fillIn(subjectClassSelector, 'Toss a coin to your witcher!');
    await fillIn(
      contentClassSelector,
      'Hereby the common folks of Velen are summoned to heed their presence to the great Geralt of Rivia!'
    );
    const actions = findAll(`.${baseModalClass}__action`);

    assert.dom(actions[1]).hasText('Save', 'SaveorNext button text is rendered as expected');
  });

  test('Preview mode displays as expected', async function(assert): Promise<void> {
    await render(hbs`
      <ChangeManagement::AddChangeLogModal
        @onCloseModal={{action this.onCloseModal}}
        @onSave={{action this.onSave}}
        @recipients={{this.followers}}
      />
    `);

    await fillIn(subjectClassSelector, 'Toss a coin to your witcher!');
    await fillIn(
      contentClassSelector,
      'Hereby the common folks of Velen are summoned to heed their presence to the great Geralt of Rivia!'
    );
    await click(emailClassSelector);
    const actions = findAll(`.${baseModalClass}__action`);
    assert.dom(actions[1]).hasText('Next', 'SaveorNext button text rendered as expected');
    await click(`.${baseModalClass}__action:nth-child(2)`);

    // Add a new Distributed list
    await click('.nacho-pill-input:nth-child(1)');
    await fillIn('.nacho-pill-input__input:nth-child(1)', 'testGroup1');
    await triggerKeyEvent('.nacho-pill-input__input:nth-child(1)', 'keyup', 13);

    // Add a new individual recipient
    await click(findAll('.nacho-pill-input')[2]);
    await click(findAll('.nacho-pill-input__input')[0]);
    await fillIn('.nacho-pill-input__input:nth-child(1)', 'testIndividualLDAP1');
    await triggerKeyEvent('.nacho-pill-input__input:nth-child(1)', 'keyup', 13);

    assert
      .dom(find(`.${baseModalClass}__content`))
      .includesText('Sending Email to 5 individuals and 1 group(s)', 'Title text is displayed correctly');

    assert
      .dom(find(`.${baseModalClass}__content`))
      .includesText('All Owners of the dataset', 'Owners are included in prompt');
    assert
      .dom(find(`.${baseModalClass}__content`))
      .includesText(
        'Group email distribution list (1)',
        'Distribution lists are included in prompt with the right count'
      );
    assert
      .dom(find(`.${baseModalClass}__content`))
      .includesText(
        'Individual email recipients (1)',
        'Individual recipients are included in prompt with the right count'
      );
    assert.dom(actions[1]).hasText('Save log & send Email', 'SaveorNext button text rendered as expected');
  });
});

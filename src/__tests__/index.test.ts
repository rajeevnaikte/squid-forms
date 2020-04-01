import { InputActionRules } from '../index';
import { ActionFoundError } from '../errors';

describe('InputActionRules', () => {
  const inputActionRules = new InputActionRules();
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const inputNameActionRules = inputActionRules.inputNameActionRules;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const ruleEvaluator = inputActionRules.ruleEvaluator;

  test('add', () => {
    const inputName = 'extension';
    const action = 'show';
    inputActionRules.add(inputName, action, '[phone number] > 0');

    const actionRules = inputNameActionRules.get(inputName) as any[];
    expect(actionRules).toBeDefined();
    expect(actionRules.length).toEqual(1);
    expect(actionRules[0].action).toEqual(action);

    const fields = ruleEvaluator.getVariables(actionRules[0].ruleName);
    expect(fields).toStrictEqual(['phone number']);
  });

  test('add duplicate', () => {
    const inputName = 'extension';
    const action = 'show';
    expect(() => inputActionRules.add(inputName, action, '[phone number] > 0'))
      .toThrow(new ActionFoundError(inputName, action));
  });

  test('update', () => {
    const inputName = 'extension';
    const action = 'show';
    inputActionRules.update(inputName, action, '[country code] > 0 and [phone number] > 0');

    const actionRules = inputNameActionRules.get(inputName) as any[];
    const fields = ruleEvaluator.getVariables(actionRules[0].ruleName);
    expect(fields.sort()).toStrictEqual(['phone number', 'country code'].sort());
  });
});

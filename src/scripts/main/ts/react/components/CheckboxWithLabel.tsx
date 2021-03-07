import React, { useState } from 'react';

type CheckboxWithLabel = {
  labelOn: string;
  labelOff: string;
};

export default function CheckboxWithLabel({ labelOn, labelOff }: CheckboxWithLabel) {
  const [isChecked, setChecked] = useState(false);

  return (
    <label style={{ marginTop: 20, display: 'inline-block' }}>
      <input type='checkbox' checked={isChecked} onChange={() => setChecked(!isChecked)} />
      {isChecked ? labelOn : labelOff}
    </label>
  );
}

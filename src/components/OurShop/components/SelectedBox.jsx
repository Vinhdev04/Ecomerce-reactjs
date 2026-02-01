import React from 'react';
import { Select } from 'antd';

function SelectedBox({ options, getSelected, defaultValue, style,typed }) {
  return (
    <Select
      defaultValue={defaultValue || options?.[0]?.value}
      style={style || { width: 120 }}
      options={options}
      onChange={getSelected }
      typed={typed}
    />
  );
}

export default SelectedBox;
 
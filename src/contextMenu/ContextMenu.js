import React from 'react'
import { Menu } from 'react-data-grid-addons'
const { ContextMenu, MenuItem, SubMenu } = Menu


class MyContextMenu extends React.Component {

  onRowDelete = (e, data) => {
    if (typeof this.props.onRowDelete === 'function') {
      this.props.onRowDelete(e, data);
    }
  };

  onRowInsertAbove = (e, data) => {
    if (typeof this.props.onRowInsertAbove === 'function') {
      this.props.onRowInsertAbove(e, data);
    }
  };

  onRowInsertBelow = (e, data) => {
    if (typeof this.props.onRowInsertBelow === 'function') {
      this.props.onRowInsertBelow(e, data);
    }
  };

  render() {
    const { idx, id, rowIdx } = this.props;

    return (
      <ContextMenu id={id}>
        <MenuItem data={{ rowIdx, idx }} onClick={this.onRowDelete}>Delete Row</MenuItem>
        <SubMenu title="Insert Row">
          <MenuItem data={{ rowIdx, idx }} onClick={this.onRowInsertAbove}>Above</MenuItem>
          <MenuItem data={{ rowIdx, idx }} onClick={this.onRowInsertBelow}>Below</MenuItem>
        </SubMenu>
      </ContextMenu>
    );
  }
}

export default MyContextMenu
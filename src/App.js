import React from 'react'
import ReactDataGrid from 'react-data-grid'
import 'react-data-grid/dist/react-data-grid.css'
import 'react-data-grid-addons/dist/react-data-grid-addons.css'
import './App.css'
import { Menu } from 'react-data-grid-addons'
import { Checkbox } from './components/checkbox'
import MyContextMenu from './contextMenu/ContextMenu'
const {
  DraggableHeader: { DraggableContainer }
} = require("react-data-grid-addons")
const { ContextMenuTrigger } = Menu;

const defaultColumnProperties = {
  sortable: true,
  editable: true,
  draggable: true,
  visible: true
}

const columns = [
  { key: 'id', name: 'ID', sortDescendingFirst: true },
  { key: 'title', name: 'Title' },
  { key: 'count', name: 'Count' }].map(c => ({ ...c, ...defaultColumnProperties }))


const createRows = () => {
  const arr = []
  for (let i = 1; i < 100; i++) {
    arr.push({
      id: i,
      title: `Title ${i}`,
      count: i * 20
    })
  }
  return arr
}

const rows = createRows()
const originalRows = rows.slice(0)

class App extends React.Component {
  state = { rows, columns, originalRows }

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    this.setState(state => {
      const rows = state.rows.slice()
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated }
      }
      return { rows }
    });
  };

  onHeaderDrop = (source, target) => {
    const stateCopy = Object.assign({}, this.state)
    const columnSourceIndex = this.state.columns.findIndex(
      i => i.key === source
    )
    const columnTargetIndex = this.state.columns.findIndex(
      i => i.key === target
    )

    stateCopy.columns.splice(
      columnTargetIndex,
      0,
      stateCopy.columns.splice(columnSourceIndex, 1)[0]
    )

    const emptyColumns = Object.assign({}, this.state, { columns: [] })
    this.setState(emptyColumns)

    const reorderedColumns = Object.assign({}, this.state, {
      columns: stateCopy.columns
    })

    this.setState(reorderedColumns)
  }

  onGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === "ASC") {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1
      } else if (sortDirection === "DESC") {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1
      }
    }
    const rows = sortDirection === "NONE" ? this.state.originalRows.slice() : this.state.rows.slice().sort(comparer)

    this.setState({ rows, sortColumn, sortDirection })

  }

  onToggleFilter = () => {
    console.log(this.state);
    this.setState(prevState => {
      const enableHeaderFilters = !prevState.enableHeaderFilters;

      if (!enableHeaderFilters) {
        return {
          enableHeaderFilters,
          filters: {}
        }
      }
      return { enableHeaderFilters }
    })
  }

  handleFilterChange = (filter) => {
    const newFilters = { ...this.state.filters };
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }

    this.setState({ filters: newFilters });

  };

  deleteRow = (e, { rowIdx }) => {
    this.state.rows.splice(rowIdx, 1);
    this.setState({ rows: this.state.rows });
  };

  insertRowAbove = (e, { rowIdx }) => {
    this.insertRow(rowIdx);
  };

  insertRowBelow = (e, { rowIdx }) => {
    this.insertRow(rowIdx + 1);
  };

  insertRow = (rowIdx) => {
    const newRow = {
      id: 0,
      title: `row ${rowIdx + 1}`,
      count: 0
    };

    const rows = [...this.state.rows];
    rows.splice(rowIdx, 0, newRow);

    this.setState({ rows });
  };

  handleInputChange = event => {
    const target = event.target;
    const cloneColumns = [...this.state.columns]
    for (let i = 0; i < cloneColumns.length; i++) {
      const column = cloneColumns[i]
      if (target.name === column.name) {
        column.visible = !column.visible
      }
    }
    this.setState({
      columns: cloneColumns
    })
  }


  render() {
    return (
      <>
        <Checkbox handleInputChange={this.handleInputChange} />

        <DraggableContainer onHeaderDrop={this.onHeaderDrop}>
          <ReactDataGrid
            columns={this.state.columns.filter(column => column.visible === true)}
            rowGetter={i => this.state.rows[i]}
            rowsCount={this.state.rows.length}
            minHeight={350}
            sortDirection={this.state.sortDirection}
            sortColumn={this.state.sortColumn}
            onGridRowsUpdated={this.onGridRowsUpdated}
            enableCellSelect
            onGridSort={this.onGridSort}
            contextMenu={
              <MyContextMenu
                id="customizedContextMenu"
                onRowDelete={this.deleteRow}
                onRowInsertAbove={this.insertRowAbove}
                onRowInsertBelow={this.insertRowBelow}
              />
            }
            RowsContainer={ContextMenuTrigger}
          />
        </DraggableContainer>
      </>
    )
  }
}

export default App
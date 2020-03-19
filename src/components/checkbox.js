import React from 'react'

export const Checkbox = props => (
  <div>
    <p>Hide column</p>
    <input type="checkbox" id="id" name="ID" onChange={props.handleInputChange} />
    <label htmlFor="id">ID</label>
    <input type="checkbox" id="title" name="Title" onChange={props.handleInputChange} />
    <label htmlFor="title">Title</label>
    <input type="checkbox" id="count" name="Count" onChange={props.handleInputChange} />
    <label htmlFor="count">Count</label>
  </div> 
)
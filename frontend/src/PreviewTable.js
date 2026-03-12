import React from "react";

function PreviewTable({ data, onCellChange }) {

if(!data || data.length === 0){
return <p>No preview available</p>
}

return(

<table>

<thead>
<tr>
{Object.keys(data[0]).map((key)=>(
<th key={key}>{key}</th>
))}
</tr>
</thead>

<tbody>

{data.map((row,i)=>(
<tr key={i}>

{Object.entries(row).map(([key,value])=>(
<td key={key}>
<input
type="text"
value={value || ""}
onChange={(e)=> onCellChange(i, key, e.target.value)}
className="table-input"
/>
</td>
))}

</tr>
))}

</tbody>

</table>

)

}

export default PreviewTable;
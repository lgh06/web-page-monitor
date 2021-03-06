/* eslint-disable react/jsx-key */
import { useTable } from "react-table";
import { useI18n, genClassNameAndString } from '../helpers'
import styles from '../styles/modules/scriptList.module.scss'

const [cn, cs] = genClassNameAndString(styles);
function ScriptList({columns, data}) {
  const { t } = useI18n();
  // console.log(data)
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });
  if(!data || data.length === 0) return <div>{t(`No Data`)}</div>

  
  // Render the UI for your table
  return (
    <section {...cn('script-list-wrap')}>
      <table {...getTableProps()} {...cn('script-list')}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
    // </Styles>
  )
}

export { ScriptList, ScriptList as default };
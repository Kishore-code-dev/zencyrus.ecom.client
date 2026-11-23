import DataGrid from '@/components/data-grid/data-grid'
import Sidebar from '@/components/Sidebar'

function EnquiryPage()
{
  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <DataGrid
        path='customquote/getallquote'
        viewId='15a84a75-c18b-0290-2f57-1987a8ea13ff'
      >

      </DataGrid>
    </div>
  )
}

export default EnquiryPage
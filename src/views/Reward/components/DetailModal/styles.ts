import styled from 'styled-components'
import { Modal, Input, Table } from 'antd'

export const StyledModal = styled(Modal)`
  width: 60%;
`
export const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
export const DetailTable = styled(Table)`
  width: 100%;
  .ant-table {
    background: none;
    color: #fff;
    tr {
      td {
        border-bottom: 1px solid rgba(87, 77, 102, 0.45);
      }
    }
    tr:last-child {
      td {
        border-bottom: none;
      }
    }
    tr: hover {
      td {
        background: none;
      }
    }
  }
  .ant-table-thead {
    tr {
      th {
        background: rgba(171, 182, 255, 0.05);
        color: #abb6ff;
        border-bottom: none;
      }
      th:first-child {
        border-top-left-radius: 7px !important;
        border-bottom-left-radius: 7px !important;
      }
      th:last-child {
        border-top-right-radius: 7px !important;
        border-bottom-right-radius: 7px !important;
      }
    }
  }
`

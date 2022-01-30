import React from 'react'
import { Table, TableHead, TableRow, TableCell, makeStyles, TableSortLabel } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    table: {
        marginTop: theme.spacing(3),
        '& thead th': {
            fontWeight: '600',
            color: '#4F21B3',
            backgroundColor: '#D4BFF9',
        },
        '& tbody td': {
            fontWeight: '300',
        },
        '& tbody tr:hover': {
            backgroundColor: '#ffffff',
            cursor: 'pointer',
        },
    },
}))

interface Data {
    company_id: String
    has_furnishing: String
    house_recommendation_id: String
    no_of_rooms: number
    house_id: String  //partition key
    no_of_toilets: number
    address: String
    nearest_mrt: String
    image_folder: String
    square_feet: number
    developer: String
    tenure: number
    price: number
    distance_to_mrt: number
    type: String
  }


/**
 * useTable component
 * This functional
 * component is used in the housingRecommendation and insuranceRecommendation pages as a
 * child component
 * @returns {JSX.Element}
 * 
 * @author Sokunthea
 */
export default function useTable(records:any, headCells:any) {

    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>("price")

    const TblContainer = (props: any) => (
        <Table className={classes.table}>
            {props.children}
        </Table>
    )

    const TblHead = (props: any) => {

        const handleSortRequest = (event: React.MouseEvent<unknown>, cellId: keyof Data) => {
            const isAsc = orderBy === cellId && order === "asc";
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(cellId)
        }

        return (<TableHead>
            <TableRow>
                {
                    headCells.map((headCell:any) => (
                        <TableCell key={headCell.id}
                            sortDirection={orderBy === headCell.id ? order : false}>
                            {headCell.disableSorting ? headCell.label :
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={(event) => { handleSortRequest(event, headCell.id) }}>
                                    {headCell.label}
                                </TableSortLabel>
                            }
                        </TableCell>))
                }
            </TableRow>
        </TableHead>)
    }
    type Order = 'asc' | 'desc';

    function getComparator<Key extends keyof any>( order: Order, orderBy: Key,
    ): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function descendingComparator<T> (a:T, b:T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
        const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const recordsAfterPagingAndSorting = () => {
        return stableSort(records, getComparator(order, orderBy))
    }

    return {
        TblContainer,
        TblHead,
        recordsAfterPagingAndSorting
    }
}
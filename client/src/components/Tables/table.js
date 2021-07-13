import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';

import TableRow from '@material-ui/core/TableRow';

const columns = [
    {
        id: 'loanNum',
        label: 'Loan Number',
        minWidth: 170
    },
    {
        id: 'borrowerName',
        label: 'Borrower',
        minWidth: 100
    },
    {
        id: 'loanAmnt',
        label: 'Loan Amount',
        minWidth: 170,
    }

];

function createData(loanNum, borrowerName, loanAmnt) {
    return { loanNum, borrowerName, loanAmnt };
}



const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440
    },
});

export default function StickyHeadTable({ tableData }) {
    const classes = useStyles();
    const rows = [];
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    tableData.forEach((row) => {
        if (row.fraud) {
            rows.push(createData(row.loanNum, row.name, formatter.format(row.loanAmount), row.pkey))
        }

    })

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.pkey}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

        </Paper>
    );
}

import './App.css';
import {useEffect, useState} from "react";
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Collapse from '@mui/material/Collapse';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Global from "./Global";

function App() {

    const [recordList, setRecordList] = useState([]);

    const [openAlert, setOpenAlert] = useState(false);

    const [openSuccess, setOpenSuccess] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams({
            isUI: "true"
        });

        const path = Global.wsPath + params.toString();

        let ws = new WebSocket(path);

        ws.onopen = function () {
            console.log("Connect to " + path);
        };

        ws.onmessage = function (data) {
            const response = JSON.parse(data.data);
            console.log("Received data from service: " + data.data);
            if (response.code === 200) {
                const list = response.data;
                setRecordList(list);
                const statusList = list.map((row) => row.status);
                if (statusList.indexOf("DOWN") >= 0) {
                    setOpenAlert(true)
                    setOpenSuccess(false)
                } else {
                    setOpenSuccess(true)
                    setOpenAlert(false)
                }
            }
        }

        ws.onclose = function () {
            console.log("Closed Connection with " + path);
        };
    }, [])

    return (
        <div className="App">
            <header className="App-header">
                <Collapse in={openAlert}>
                    <Alert variant="filled" severity="error">
                        There are one or more services DOWN!!!
                    </Alert>
                </Collapse>
                <Collapse in={openSuccess}>
                    <Alert variant="filled" severity="success">
                        All services are up!!!
                    </Alert>
                </Collapse>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Service Name</TableCell>
                                <TableCell align="center">Endpoint</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Last Updated</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                recordList.map((row) => (
                                    <TableRow
                                        hover
                                        key={row.registration}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                        <TableCell align="center">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.location.map.endpoint}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.status}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.metadata.map.lastUpdated}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </header>
        </div>
    );
}

export default App;

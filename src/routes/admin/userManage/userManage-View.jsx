import { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Alert, Fade, Pagination, Form } from 'react-bootstrap';
import IconDelete from '../../../assets/icons/delete.svg';
import IconAdd from '../../../assets/icons/add.svg';
import IconUserDetail from '../../../assets/icons/userDetail.svg';
import IconExcel from '../../../assets/img/iconExcel.png';
import IconRestore from '../../../assets/icons/restore.svg';

import { UserForm, UserDetailsView, UserDelAlert, UserRestoreAlert, AlertError } from '../../../components/components';

import functionDate from '../../../components/functionDate';
import { Link } from 'react-router-dom';  // Aquí está la línea añadida

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiUrls from '../../../api';
// ... tus otros imports
import { Doughnut, Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import './userManage.css'; // Asegúrate de que el archivo CSS está en la misma carpeta y correctamente referenciado

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

import ChartDataLabels from 'chartjs-plugin-datalabels';


// ... dentro de tu componente, antes del return


const options = {
    responsive: true,
    maintainAspectRatio: true, // Cambia a false si no quieres mantener la relación de aspecto
    aspectRatio: 1, // Define la relación de aspecto del gráfico, por defecto es 2 (doble de ancho que alto)
    // ... otras opciones
};



const userManageView = (props) => {

    const { users, handleDelete, handleCreate, setUser, user, clave, handleUserDetail, userDetail, dataUserDelete, setDataUserDelete, userResponses, userMetadata, userRestoreData, SetuserRestoreData } = props;

    //mostrar y ocultar UserForm
    const [showUserForm, setShowUserForm] = useState(false);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showRestore, setShowRestore] = useState(false);

    const [showFeedbackError, setShowFeedbackError] = useState(false);
    const [showUserRestoreFeedback, setShowUserRestoreFeedback] = useState(false);
    const [showUserDeleteFeedback, setShowUserDeleteFeedback] = useState(false);
    const [showUserCreateFeedback, setShowUserCreateFeedback] = useState(false);




    const handleShowUserForm = () => setShowUserForm(true);

    const [examStatusFilter, setExamStatusFilter] = useState(''); // Estado para el filtro de estado de examen

    // Función para manejar el cambio en el selector de filtro de estado de examen
    const handleExamStatusFilterChange = (event) => {
        setExamStatusFilter(event.target.value);
    };


    const [chartData, setChartData] = useState({
        labels: ['Pendiente', 'Contestando', 'Validado', 'Terminado'],
        datasets: [
            {
                label: 'Usuarios por Estado de Examen',
                data: [0, 0, 0, 0], // Inicialmente 0 para cada estado
                backgroundColor: [
                    'rgba(200, 200, 200, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 205, 86, 0.6)'
                ],
                borderColor: [
                    'rgba(200, 200, 200, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',

                    'rgba(255, 205, 86, 1)'
                ],
                borderWidth: 1,
            },
        ],
    });

    const dataEstudiantes = {
        labels: ['Total de usuarios', 'Pendientes', 'Contestando', 'Validado', 'Esperando resultados'],
        datasets: [
            {
                label: 'Estado de test vocacional',
                backgroundColor: '#1ab1de20',
                borderColor: '#1ab1de',
                borderWidth: 1,
                hoverBackgroundColor: '#1ab1de80',
                hoverBorderColor: '#1ab1de',
                data: [users.length,
                chartData.datasets[0].data[0],
                chartData.datasets[0].data[1],
                chartData.datasets[0].data[2],
                chartData.datasets[0].data[3]],
            },
        ],
    };

    useEffect(() => {
        const examStatusCounts = { '0': 0, '1': 0, '2': 0, '3': 0 };
        users.forEach(user => {
            if (user.Estado_examen in examStatusCounts) {
                examStatusCounts[user.Estado_examen]++;
            }
        });

        setChartData(prevChartData => ({
            ...prevChartData,
            datasets: [
                {
                    ...prevChartData.datasets[0],
                    data: [examStatusCounts['0'], examStatusCounts['1'], examStatusCounts['2'], examStatusCounts['3']]
                }
            ]
        }));
    }, [users]); // Dependencia: 'users', para que se actualice cuando los usuarios cambien

    const handleExcelUpload = async () => {

        try {
            const response = await axios.post(apiUrls.crearUsuario, {
            });
            console.log(response.data);

        } catch (error) {
            console.error('Error updating the response:', error);
        }      // Aquí puedes agregar la lógica para subir el archivo Excel
    };
    const enviarMensaje = async () => {

        try {
            const response = await axios.post(apiUrls.enviarUsuario, {
            });
            console.log(response.data);



        } catch (error) {
            console.error('Error updating the response:', error);
        }      // Aquí puedes agregar la lógica para subir el archivo Excel
    };

    const handleUserDetailViewFunction = (Id_usuario) => {
        handleUserDetail(Id_usuario);
        setShowUserDetails(true);
    }

    const handleShowDeleteUserFunction = (datosUsuario) => {
        setDataUserDelete(datosUsuario);
        setShowDelete(true);
    }

    const handleUserDetailView = (Id_usuario) => {
        handleUserDetail(Id_usuario);
        setShowUserDetails(true);
    }

    const handleShowDeleteUser = (datosUsuario) => {
        setDataUserDelete(datosUsuario);
        setShowDelete(true);
    }

    const handleDeleteUser = () => {
        handleDelete(dataUserDelete.Id_usuario);
        setShowDelete(false);
    };


    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleRestoreTestFunction = (user) => {
        SetuserRestoreData(user);
        setShowRestore(true);
    };

    const filteredUsers = users.filter(user => {
        return (
            (examStatusFilter === '' || user.Estado_examen.toString() === examStatusFilter) &&
            (user.Nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.Apellido_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.Correo_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.Telefono_usuario.toLowerCase().includes(searchTerm.toLowerCase()))
            // ... otros campos por los que quieras filtrar
        );
    });

    const getExamStatusDetails = (status) => {
        switch (status) {
            case 0:
                return { style: { backgroundColor: 'rgba(200, 200, 200, 0.6)', color: 'black' }, text: 'Pendiente' };
            case 1:
                return { style: { backgroundColor: 'rgba(75, 192, 192, 0.6)', color: 'black' }, text: 'Contestando' };
            case 2:
                return { style: { backgroundColor: 'rgba(255, 99, 132, 0.6)', color: 'white' }, text: 'Validado' };
            case 3:
                return { style: { backgroundColor: 'rgba(255, 205, 86, 0.6)', color: 'white' }, text: 'Terminado' };
            default:
                return { style: {}, text: status }; // Muestra el estado como está si no coincide con los casos anteriores
        }
    };


    const optionsDoughnut = {
        plugins: {
            legend: {
                display: true,
                position: 'right',
            },
            datalabels: {
                formatter: (value, context) => {
                    const percentage = (value / context.dataset.data.reduce((a, b) => a + b, 0)) * 100;
                    return `${percentage.toFixed(2)}%`;
                },
            },
        },
    };

    return (
        <Container>

            <Row className="mb-3">
                <Col>
                    <h4>Gestión de Estudiantes</h4>
                </Col>
            </Row>

            <UserForm
                showUserForm={showUserForm}
                setShowUserForm={setShowUserForm}
                handleCreate={handleCreate}
                setUser={setUser}
                user={user}
                clave={clave}
            />
            <UserCreateFeedback
                showUserCreateFeedback={showUserCreateFeedback}
                setShowUserCreateFeedback={setShowUserCreateFeedback}
                setShowFeedbackError={setShowFeedbackError}
            />
            <UserDetailsView
                users={users}
                showModal={showUserDetails}
                setShowUserDetails={setShowUserDetails}
                userDetail={userDetail}
            />

            <UserDelAlert
                showDelete={showDelete}
                setShowDelete={setShowDelete}
                handleDeleteUser={handleDeleteUser}
                dataUserDelete={dataUserDelete}
            />
            <UserDeleteFeedback
                showUserDeleteFeedback={showUserDeleteFeedback}
                setShowUserDeleteFeedback={setShowUserDeleteFeedback}
            />

            <UserRestoreAlert
                showRestore={showRestore}
                setShowRestore={setShowRestore}
                handleRestoreTest={() => handleRestoreTest(userRestoreData.Id_usuario)}
                dataUser={userRestoreData}
                setShowUserRestoreFeedback={setShowUserRestoreFeedback}
                setShowFeedbackError={setShowFeedbackError}
            />
            <UserRestoreFeedback
                showUserRestoreFeedback={showUserRestoreFeedback}
                setShowUserRestoreFeedback={setShowUserRestoreFeedback}
            />
            <Row className="mb-3">

                <Col md={8} sm={{ order: 1 }} xs={{ order: 2 }}>
                    <Row className="mb-3">
                        <Col md={3} xs={4} className="d-flex align-items-stretch">
                            <Button className='btn-accion' variant="success" onClick={handleShowUserForm}>
                                <img src={IconAdd} alt="Agregar Usuario" /> Agregar Usuario
                            </Button>
                        </Col>
                        <Col md={4} xs={4} className="d-flex align-items-stretch">
                            <Button variant="success" onClick={handleExcelUpload} >
                                <img src={IconExcel} alt="Subir Excel" style={{ width: '8%' }} /> Crear desde Sheets
                            </Button>
                        </Col>
                        <Col md={5} xs={4} className="d-flex align-items-stretch">
                            <Button variant="success" onClick={enviarMensaje} >
                                <img src={IconExcel} alt="Subir Excel" style={{ width: '8%' }} /> Enviar pass desde Sheets
                            </Button>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <UsersTable
                            users={users}
                            handleShowUserForm={handleShowUserForm}
                            handleUserDetailViewFunction={handleUserDetailViewFunction}
                            handleRestoreTestFunction={handleRestoreTestFunction}
                            handleShowDeleteUserFunction={handleShowDeleteUserFunction}
                            handleExcelUpload={handleExcelUpload}
                            chartData={chartData}
                            enviarMensaje={enviarMensaje}
                            handleSearchChange={handleSearchChange}
                            examStatusFilter={examStatusFilter}
                            handleExamStatusFilterChange={handleExamStatusFilterChange}
                            getExamStatusDetails={getExamStatusDetails}
                            userResponses={userResponses}
                        />
                    </Row>

                </Col>
                <Col md={4} sm={{ order: 2 }} xs={{ order: 1 }}>
                    <Row className="mb-3">
                        <Col md>
                            {/*<h6>Total de Usuarios: {users.length}</h6>
                            <h6>Pendiente: {chartData.datasets[0].data[0]}</h6>
                            <h6>Contestando: {chartData.datasets[0].data[1]}</h6>
                            <h6>Validado: {chartData.datasets[0].data[2]}</h6>
                            <h6>Esperando resultados : {chartData.datasets[0].data[3]}</h6>
                            */}

                            <Chart
                                type="bar"
                                data={dataEstudiantes}
                                plugins={[ChartDataLabels]}
                                options={{
                                    indexAxis: 'y',

                                }}
                            />
                        </Col>
                    </Row >
                    <Row className="mb-3">
                        <Col>
                            <Row className="mb-3">
                                <Col>
                                    <Doughnut data={chartData}
                                        plugins={[ChartDataLabels]}
                                        options={optionsDoughnut}
                                        className='chart' />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}



const UsersTable = ({ users, handleShowUserForm, handleUserDetailViewFunction,
    handleRestoreTestFunction, handleShowDeleteUserFunction, handleExcelUpload,
    enviarMensaje, chartData, handleSearchChange, handleExamStatusFilterChange,
    examStatusFilter, getExamStatusDetails, userResponses }) => {
    const itemsPerPage = 10; // Número de registros por página
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); // Hook para la navegación

    const removePunctuation = (text) => {
        return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    };

    const filteredUsers = users.filter(user =>
        (examStatusFilter === '' || user.Estado_examen.toString() === examStatusFilter) && (
            `${removePunctuation(user.Nombre_usuario)} ${removePunctuation(user.Apellido_usuario)}`.toLowerCase().includes(removePunctuation(searchTerm.toLowerCase())) ||
            removePunctuation(user.Correo_usuario).toLowerCase().includes(removePunctuation(searchTerm.toLowerCase())) ||
            removePunctuation(user.Telefono_usuario).toLowerCase().includes(removePunctuation(searchTerm.toLowerCase()))
        )
    );

    // Calcula el índice del último elemento en la página actual
    const lastIndex = currentPage * itemsPerPage;
    // Calcula el índice del primer elemento en la página actual
    const firstIndex = lastIndex - itemsPerPage;
    // Obtiene los usuarios a mostrar en la página actual
    const currentUsers = filteredUsers.slice(firstIndex, lastIndex);

    // Calcula el número total de páginas
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Cambia la página actual
    const handlePageChange = page => setCurrentPage(page);
    const viewResults = (Id_usuario) => {

        localStorage.setItem('ID_results', Id_usuario);
        navigate('/resultados');
    };

    //opciones de paginación

    const maxVisiblePages = 5; // Número máximo de páginas visibles
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfMaxVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    // Ajustar el inicio de la página si estamos cerca del final
    startPage = Math.max(endPage - maxVisiblePages + 1, 1)

    return (
        <>
            <Row>
                <Col md={12}>
                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Buscar por nombre o correo"
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </Col>
                        <Col md={6} className="mb-3">
                            <Form.Select
                                className="form-control"
                                value={examStatusFilter}
                                onChange={handleExamStatusFilterChange}
                            >
                                <option value="">Todos los Estados</option>
                                <option value="1">Contestando</option>
                                <option value="2">Validado</option>
                                <option value="3">Terminado</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={12} >
                            <Table striped hover responsive>
                                <thead>
                                    <tr>
                                        <th>Estado</th>
                                        <th>Nombre</th>
                                        <th>Respuestas</th>
                                        <th>Contacto</th>
                                        <th>Creado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {currentUsers.map((user, index) => {
                                        const { style, text } = getExamStatusDetails(user.Estado_examen);
                                        return (
                                            <tr key={index}>
                                                <td style={style}>{text}</td>
                                                <td>{user.Nombre_usuario} {user.Apellido_usuario}</td>
                                                <td>{userResponses[user.Id_usuario] ? userResponses[user.Id_usuario].length : 0}</td>

                                                <td>{user.Correo_usuario}<br />{user.Telefono_usuario}</td>
                                                <td>{functionDate(user.createdAt)}</td>
                                                <td className='acciones'>
                                                    <Button className='btn-accion' variant="primary" onClick={() => viewResults(user.Id_usuario)} title='Ver resultados' >
                                                        <FontAwesomeIcon icon={faChartLine} />
                                                    </Button>
                                                    <Button className='btn-accion' variant="success" size="sm" onClick={() => handleUserDetailViewFunction(user.Id_usuario)} title='Ver detalles'>
                                                        <img src={IconUserDetail} alt="User Detail" />
                                                    </Button>
                                                    <Button className='btn-accion' variant="secondary" size="sm" onClick={() => handleRestoreTestFunction(user)} title='Restaurar avance'>
                                                        <img src={IconRestore} alt="Restore" />
                                                    </Button>
                                                    <Button className='btn-accion' variant="danger" size="sm" onClick={() => handleShowDeleteUserFunction(user)} title='Eliminar usuario'>
                                                        <img src={IconDelete} alt="Delete" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                            <br />
                            {/* Paginación */}
                            <Pagination>
                                {currentPage > 1 && (
                                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
                                )}

                                {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                                    <Pagination.Item
                                        key={startPage + index}
                                        active={startPage + index === currentPage}
                                        onClick={() => handlePageChange(startPage + index)}
                                    >
                                        {startPage + index}
                                    </Pagination.Item>
                                ))}

                                {currentPage < totalPages && (
                                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
                                )}
                            </Pagination>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

const UserCreateFeedback = (props) => {
    const { showUserCreateFeedback, setShowUserCreateFeedback } = props;

    useEffect(() => {
        // Establecer el temporizador para cambiar la visibilidad después de 5 segundos
        const timer = setTimeout(() => {
            setShowUserCreateFeedback(false);
        }, 5000);

        // Limpiar el temporizador si el componente se desmonta antes de que expire
        return () => clearTimeout(timer);
    }, [showUserCreateFeedback, setShowUserCreateFeedback]);

    return (
        <>
            <Fade in={showUserCreateFeedback}>
                <Alert variant="success" show={showUserCreateFeedback}>
                    Usuario Creado correctamente.
                </Alert>
            </Fade>
        </>
    );
};

const UserRestoreFeedback = (props) => {
    const { showUserRestoreFeedback, setShowUserRestoreFeedback } = props;

    useEffect(() => {
        // Establecer el temporizador para cambiar la visibilidad después de 5 segundos
        const timer = setTimeout(() => {
            setShowUserRestoreFeedback(false);
        }, 5000);

        // Limpiar el temporizador si el componente se desmonta antes de que expire
        return () => clearTimeout(timer);
    }, [showUserRestoreFeedback, setShowUserRestoreFeedback]);

    return (
        <>
            <Fade in={showUserRestoreFeedback}>
                <Alert variant="success" show={showUserRestoreFeedback}>
                    Datos de test del usuario restaurados correctamente.
                </Alert>
            </Fade>
        </>
    );
};

const UserDeleteFeedback = (props) => {
    const { showUserDeleteFeedback, setShowUserDeleteFeedback } = props;

    useEffect(() => {
        // Establecer el temporizador para cambiar la visibilidad después de 5 segundos
        const timer = setTimeout(() => {
            setShowUserDeleteFeedback(false);
        }, 5000);

        // Limpiar el temporizador si el componente se desmonta antes de que expire
        return () => clearTimeout(timer);
    }, [showUserDeleteFeedback, setShowUserDeleteFeedback]);

    return (
        <>
            <Fade in={showUserDeleteFeedback}>
                <Alert variant="warning" show={showUserDeleteFeedback}>
                    Usuario eliminado correctamente.
                </Alert>
            </Fade>
        </>
    );
};


export default userManageView
import { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Alert, Fade, Pagination, Form } from 'react-bootstrap';
import IconDelete from '../../../assets/icons/delete.svg';
import IconAdd from '../../../assets/icons/add.svg';
import IconUserDetail from '../../../assets/icons/userDetail.svg';
import IconExcel from '../../../assets/img/iconExcel.png';
import IconRestore from '../../../assets/icons/restore.svg';
import { faTimesCircle, faUserPlus, faCheckCircle, faEdit, faRedo } from '@fortawesome/free-solid-svg-icons'; // Añade faRedo aquí
import { UserForm, UserDetailsView, UserDelAlert, UserRestoreAlert, AlertError, MembershipRenewalForm } from '../../../components/components';

import functionDate from '../../../components/functionDate';
import { Link } from 'react-router-dom';  // Aquí está la línea añadida

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiUrls from '../../../api';
// ... tus otros imports
import { Doughnut, Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import './clientesManage.css'; // Asegúrate de que el archivo CSS está en la misma carpeta y correctamente referenciado

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faDownload } from '@fortawesome/free-solid-svg-icons';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { differenceInDays, parseISO } from 'date-fns';


//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


// ... dentro de tu componente, antes del return


const options = {
    responsive: true,
    maintainAspectRatio: true, // Cambia a false si no quieres mantener la relación de aspecto
    aspectRatio: 1, // Define la relación de aspecto del gráfico, por defecto es 2 (doble de ancho que alto)
    // ... otras opciones
};



const clientesManageView = (props) => {

    const { users, handleDelete, handleCreate, setUser, user, clave,
        handleUserDetail, userDetail, dataUserDelete, setDataUserDelete,
        userResponses, userMetadata, userRestoreData, SetuserRestoreData,
        handleUpdateUser, renewMembership, membershipOptions, editingUser, setEditingUser } = props;

    //mostrar y ocultar UserForm
    const [showUserForm, setShowUserForm] = useState(false);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showRestore, setShowRestore] = useState(false);

    const [showFeedbackError, setShowFeedbackError] = useState(false);
    const [showUserRestoreFeedback, setShowUserRestoreFeedback] = useState(false);
    const [showUserDeleteFeedback, setShowUserDeleteFeedback] = useState(false);
    const [showUserCreateFeedback, setShowUserCreateFeedback] = useState(false);


    const [showEditUserForm, setShowEditUserForm] = useState(false);
    const [showRenewalForm, setShowRenewalForm] = useState(false);
    const [selectedUserForRenewal, setSelectedUserForRenewal] = useState(null);




    const handleRenewMembership = (user) => {
        console.log("RENOVANDO", user);
        // Aquí iría la lógica para procesar la renovación de la membresía...

        setSelectedUserForRenewal(user);
        setShowRenewalForm(true);
    };


    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowEditUserForm(true);
    };


    const handleShowUserForm = () => {
        setShowUserForm(true);  // Asegúrate de que esta línea está estableciendo el estado correctamente
        setEditingUser(null);  // Asegúrate de restablecer cualquier usuario que estuviera en edición
    };
    const [examStatusFilter, setExamStatusFilter] = useState(''); // Estado para el filtro de estado de examen

    // Función para manejar el cambio en el selector de filtro de estado de examen
    const handleExamStatusFilterChange = (event) => {
        setExamStatusFilter(event.target.value);
    };


    const countMembershipStatus = users => {
        const statusCounts = { vencido: 0, proximoAVencer: 0, activo: 0, vencidoReciente: 0 };
        users.forEach(user => {
            const status = getMembershipStatus(user.Fecha); // Asume que esta función ya está implementada correctamente
            if (status.text === 'Vencido') {
                statusCounts.vencido++;
            } else if (status.text === 'Vencido reciente') {
                statusCounts.vencidoReciente++;
            } else if (status.text === 'Próximo a vencer') {
                statusCounts.proximoAVencer++;
            } else if (status.text === 'Activo') {
                statusCounts.activo++;
            }
        });
        return statusCounts;
    };




    useEffect(() => {
        const statusCounts = countMembershipStatus(users); // Contar el número de usuarios por estado
        setChartData({
            ...chartData,
            datasets: [{
                ...chartData.datasets[0],
                data: [
                    statusCounts.vencido,        // Número de usuarios vencidos
                    statusCounts.vencidoReciente, // Número de usuarios vencidos recientemente
                    statusCounts.proximoAVencer, // Número de usuarios próximos a vencer
                    statusCounts.activo,          // Número de usuarios activos
                ], // Asegúrate de tener cuatro valores para las categorías
            }],
        });
    }, [users]);

    const [chartData, setChartData] = useState({
        labels: ['Vencido', 'Vencido reciente', 'Próximo a vencer', 'Activo'], // Orden de etiquetas
        datasets: [
            {
                label: 'Usuarios por Estado de Membresía',
                data: [0, 0, 0, 0], // Asegúrate de tener cuatro valores, uno por cada etiqueta
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',  // Rojo para vencidos
                    'rgba(255, 165, 0, 0.6)',  // Naranja para vencidos recientemente
                    'rgba(255, 206, 86, 0.6)', // Amarillo para próximos a vencer
                    'rgba(75, 192, 192, 0.6)', // Verde para activos
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',  // Borde para vencidos
                    'rgba(255, 165, 0, 1)',   // Borde para vencidos recientemente (naranja)
                    'rgba(255, 206, 86, 1)',  // Borde para próximos a vencer (amarillo)
                    'rgba(75, 192, 192, 1)',  // Borde para activos (verde)
                ],
                borderWidth: 1,
            },
        ],
    });

    const dataEstudiantes = {
        labels: ['Total de usuarios', 'Vencido', 'Vencido reciente', 'Próximo a vencer', 'Activo'], // Alineación de etiquetas
        datasets: [
            {
                label: 'Estado de Membresía',
                backgroundColor: [
                    '#1ab1de20',
                    '#ff6384',  // Rojo para vencidos
                    '#ffa500',  // Naranja para vencidos recientemente
                    '#ffce56',  // Amarillo para próximos a vencer
                    '#4bc0c0',  // Verde para activos
                ], // Asegúrate de tener colores diferentes para cada categoría
                borderColor: '#1ab1de',
                borderWidth: 1,
                hoverBackgroundColor: [
                    '#1ab1de80',
                    '#ff6384b3', // Rojo para hover de vencidos
                    '#ffa500b3', // Naranja para hover de vencidos recientemente
                    '#ffce56b3', // Amarillo para hover de próximos a vencer
                    '#4bc0c0b3', // Verde para hover de activos
                ],
                hoverBorderColor: '#1ab1de',
                data: [
                    users.length, // Total de usuarios
                    chartData.datasets[0].data[0], // Vencido
                    chartData.datasets[0].data[1], // Vencido reciente
                    chartData.datasets[0].data[2], // Próximo a vencer
                    chartData.datasets[0].data[3], // Activo
                ],
            },
        ],
    };



    const handleUserDetailViewFunction = (Id_usuario) => {
        console.log("UD:", Id_usuario)
        handleUserDetail(Id_usuario);
        setShowUserDetails(true);
    }

    const handleShowDeleteUserFunction = (userId) => {
        console.log("handleShowDeleteUserFunction.....", userId)
        var id_buscado = userId;

        // Utiliza la función find para buscar el registro con el Id_usuario especificado
        var registro_encontrado = users.find(function (registro) {
            return registro.ID === id_buscado;
        });

        setDataUserDelete(registro_encontrado);
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
        handleDelete(dataUserDelete);
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





    const getMembershipStatus = (membershipEndDate) => {
        const today = new Date();
        if (!membershipEndDate) {
            // Manejar el caso en que la fecha es null o undefined
            return { style: { backgroundColor: 'rgba(211, 211, 211, 0.6)', color: 'black' }, text: 'Fecha no disponible', daysDifference: 'N/A' };
        }
        const endDate = parseISO(membershipEndDate);
        const daysDifference = differenceInDays(endDate, today);

        // Devolver el número de días junto con el estado
        let status = 'Activo';
        let backgroundColor = 'rgba(75, 192, 192, 0.6)'; // Color para usuarios activos

        // Vencido
        if (daysDifference < 0) {
            if (daysDifference >= -7) {
                status = 'Vencido reciente';
                backgroundColor = 'rgba(255, 206, 86, 0.6)'; // Color para vencidos recientemente
            } else {
                status = 'Vencido';
                backgroundColor = 'rgba(255, 99, 132, 0.6)'; // Color para vencidos
            }
        } else if (daysDifference <= 7) {
            // Próximo a vencer
            status = 'Próximo a vencer';
            backgroundColor = 'rgba(255, 205, 86, 0.6)'; // Color para próximos a vencer
        }

        return { style: { backgroundColor, color: 'black' }, text: status, daysDifference };
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


    const descargarReporte = async (idUser) => {
        try {
            // Solicitar el archivo PDF como un Blob
            const response = await axios.get(`${apiUrls.getReporte}`, {
                params: {
                    idEstudiante: idUser
                },
                responseType: 'blob', // Indica que esperamos una respuesta en forma de Blob
            });

            // Crear una URL para el Blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            //  setPdfUrl(url); // Establecer la URL del PDF en el estado
            //  setShowPDFModal(true); // Abrir el modal
            // Crear un enlace temporal para descargar el archivo
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ReporteDeEstudiantes.pdf`); // Asignar un nombre al archivo descargado
            document.body.appendChild(link);

            // Iniciar la descarga
            link.click();

            // Limpiar al finalizar
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log("Descarga iniciada");

        } catch (error) {
            // Manejar errores de la API o de red
            console.error('Error al hacer la solicitud:', error.message);
        }
    };
    
    return (
        <Container>

            <Row className="mb-3">
                <Col>
                    <h4>Gestión de Estudiantes</h4>
                </Col>
            </Row>
            {showUserForm && (
                <UserForm
                    showUserForm={showUserForm}
                    setShowUserForm={setShowUserForm}
                    handleCreate={handleCreate} // Suponiendo que handleCreate es tu función para agregar un nuevo usuario
                    setUser={setUser} // setUser para resetear o preparar un nuevo usuario
                    user={user} // Esto debería ser un objeto de usuario vacío o null si es un nuevo usuario
                    isEditing={false} // Indica que no está en modo de edición
                />
            )}

            {showEditUserForm && (
                <UserForm
                    showUserForm={showEditUserForm}
                    setShowUserForm={setShowEditUserForm}
                    handleCreate={handleUpdateUser} // Asegúrate de implementar esta función
                    setUser={setEditingUser}
                    user={editingUser}
                    isEditing={true} // Puedes usar esta prop para diferenciar entre crear y editar
                />
            )}

            {showRenewalForm && (
                <MembershipRenewalForm
                    show={showRenewalForm}
                    handleClose={() => setShowRenewalForm(false)}
                    user={selectedUserForRenewal}
                    renewMembership={renewMembership}
                    membershipOptions={membershipOptions}
                    renewMembership2={(user, membershipType, paymentMethod, comments) => {
                        // Aquí iría la lógica para renovar la membresía
                        console.log('Renovando membresía para', user.ID);
                        console.log('Tipo', membershipType);
                        console.log('Método', paymentMethod);
                        console.log('Comentarios', comments);



                        setShowRenewalForm(false);
                        // Actualiza la lista de usuarios o realiza acciones adicionales según sea necesario
                    }}
                />
            )}


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
                        <Col md={3} xs={4} className="d-flex align-items-stretch">
                            <Button className='btn-accion' variant="success" onClick={descargarReporte}>
                                <FontAwesomeIcon icon={faDownload} /> Descargar reporte
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

                            chartData={chartData}

                            handleSearchChange={handleSearchChange}
                            examStatusFilter={examStatusFilter}
                            handleExamStatusFilterChange={handleExamStatusFilterChange}

                            userResponses={userResponses}
                            handleEditUser={handleEditUser}
                            handleRenewMembership={handleRenewMembership}
                            getMembershipStatus={getMembershipStatus}
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
    examStatusFilter, userResponses, handleEditUser, handleRenewMembership, getMembershipStatus }) => {
    const itemsPerPage = 10; // Número de registros por página
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); // Hook para la navegación

    const removePunctuation = (text) => {
        return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    };


    const filteredUsers = users.filter(user => {
        const status = getMembershipStatus(user.Fecha).text;
        return (
            (examStatusFilter === '' || status === examStatusFilter) &&
            (user.Nombre && user.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.Email && user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.Celular && user.Celular.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });
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

    const descargarRecibo = async (idUser) => {
        try {
            // Solicitar el archivo PDF como un Blob
            const response = await axios.get(`${apiUrls.getrecibo}`, {
                params: {
                    idEstudiante: idUser
                },
                responseType: 'blob', // Indica que esperamos una respuesta en forma de Blob
            });

            // Crear una URL para el Blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            //  setPdfUrl(url); // Establecer la URL del PDF en el estado
            //  setShowPDFModal(true); // Abrir el modal
            // Crear un enlace temporal para descargar el archivo
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `recibo_${idUser}.pdf`); // Asignar un nombre al archivo descargado
            document.body.appendChild(link);

            // Iniciar la descarga
            link.click();

            // Limpiar al finalizar
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log("Descarga iniciada");

        } catch (error) {
            // Manejar errores de la API o de red
            console.error('Error al hacer la solicitud:', error.message);
        }
    };



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
                                <option value="Vencido">Vencido</option>
                                <option value="Próximo a vencer">Próximo a vencer</option>
                                <option value="Activo">Activo</option>
                            </Form.Select>
                        </Col>


                    </Row>
                    <Row className="mb-3">
                        <Col md={12} >
                            <Table striped hover responsive>
                                <thead>
                                    <tr>
                                        <th>Estado</th>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Celular</th>
                                        <th>Email</th>
                                        <th>Membresía</th>
                                        <th>Días de Vencimiento</th> {/* Nueva columna */}
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {currentUsers.map((user, index) => {
                                        const membershipStatus = getMembershipStatus(user.Fecha); // Asume que 'Fecha' es la fecha de finalización de la membresía

                                        return (
                                            <tr key={index}>
                                                <td style={membershipStatus.style}>{membershipStatus.text}</td>
                                                <td>{user.ID} </td>
                                                <td>{user.Nombre} </td>

                                                <td>{user.Celular}</td>
                                                <td>{user.Email} </td>


                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        {functionDate(user.Fecha)}
                                                        <Button className='btn-accion' variant="warning" onClick={() => handleRenewMembership(user)} title='Renovar Membresía'>
                                                            <FontAwesomeIcon icon={faRedo} />
                                                        </Button>
                                                    </div>
                                                </td>

                                                <td>{membershipStatus.daysDifference}</td> {/* Mostrar días de vencimiento */}

                                                <td className='acciones'>
                                                    <Button className='btn-accion' variant="primary" onClick={() => descargarRecibo(user.ID)} title='Descargar recibo'>
                                                        <FontAwesomeIcon icon={faDownload} />  {/* Cambiado para usar el ícono de descarga */}
                                                    </Button>

                                                    <Button hidden className='btn-accion' variant="primary" onClick={() => viewResults(user.Id_usuario)} title='Ver resultados' >
                                                        <FontAwesomeIcon icon={faChartLine} />
                                                    </Button>


                                                    <Button className='btn-accion' variant="success" size="sm" onClick={() => handleUserDetailViewFunction(user.ID)} title='Ver detalles'>
                                                        <img src={IconUserDetail} alt="User Detail" />
                                                    </Button>
                                                    <Button variant="primary" onClick={() => handleEditUser(user)} title="Editar Usuario" className="btn-accion">
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>

                                                    <Button className='btn-accion' variant="danger" size="sm" onClick={() => handleShowDeleteUserFunction(user.ID)} title='Eliminar usuario'>
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


export default clientesManageView;
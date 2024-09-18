import { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Alert, Fade, Pagination, Form } from 'react-bootstrap';
import IconDelete from '../../../assets/icons/delete.svg';
import IconAdd from '../../../assets/icons/add.svg';
import IconUserDetail from '../../../assets/icons/userDetail.svg';
import IconExcel from '../../../assets/img/iconExcel.png';
import IconRestore from '../../../assets/icons/restore.svg';

import { UserForm, UserDetailsView, UserDelAlert, UserRestoreAlert, AlertError,TournamentForm,MatchForm } from '../../../components/components';

import functionDate from '../../../components/functionDate';
import { Link } from 'react-router-dom';  // Aquí está la línea añadida

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiUrls from '../../../api';
// ... tus otros imports
import { Doughnut, Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import './torneosManage.css'; // Asegúrate de que el archivo CSS está en la misma carpeta y correctamente referenciado

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

import ChartDataLabels from 'chartjs-plugin-datalabels';


import Bracket from './Bracket';
// ... dentro de tu componente, antes del return
import React from 'react';
import { Modal } from 'react-bootstrap';


const options = {
    responsive: true,
    maintainAspectRatio: true, // Cambia a false si no quieres mantener la relación de aspecto
    aspectRatio: 1, // Define la relación de aspecto del gráfico, por defecto es 2 (doble de ancho que alto)
    // ... otras opciones
};


const fetchTournamentData = () => Promise.resolve({
    "rounds": [
      {
        "roundNumber": 1,
        "matches": [
          {
            "teams": ["Equipo x1", "Equipo 2"],
            "winner": "Equipo x1"
          },
          {
            "teams": ["Equipo 3", "Equipo 4"],
            "winner": "Equipo 3"
          }
          ,
          {
            "teams": ["Equipo 33", "Equipo 41"],
            "winner": "Equipo 33"
          }
          ,
          {
            "teams": ["Equipo 323", "Equipo 421"],
            "winner": "Equipo 421"
          }
        ]
      },
      {
        "roundNumber": 2,
        "matches": [
          {
            "teams": ["Equipo x1", "Equipo 2"],
            "winner": "Equipo x1"
          },
          {
            "teams": ["Equipo 3", "Equipo 4"],
            "winner": "Equipo 3"
          },
          {
            "teams": ["Equipo 33", "Equipo 421"],
            "winner": "Equipo 33"
          }
        ]
      },
      {
        "roundNumber": 3,
        "matches": [
          {
            "teams": ["Equipo x1", "Equipo 3"],
            "winner": "Equipo 3"
          }
        ]
      }
    ]
  });
const torneosManageView = (props) => {

    const [tournamentData, setTournamentData] = useState(null);

    useEffect(() => {
      fetchTournamentData().then(data => {
        setTournamentData(data);
      });
    }, []);

    const {torneos,partidos, users, handleDelete, handleCreate, setUser, 
        user, clave, handleUserDetail, userDetail, dataUserDelete, 
        setDataUserDelete, userResponses, userMetadata, userRestoreData, 
        SetuserRestoreData, fetchAndSetTorneos} = props;



    const [showUserForm, setShowUserForm] = useState(false);
    const [showTournamentForm, setShowTournamentForm] = useState(false);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showRestore, setShowRestore] = useState(false);

    const [showFeedbackError, setShowFeedbackError] = useState(false);
    const [showUserRestoreFeedback, setShowUserRestoreFeedback] = useState(false);
    const [showUserDeleteFeedback, setShowUserDeleteFeedback] = useState(false);
    const [showUserCreateFeedback, setShowUserCreateFeedback] = useState(false);

    const [showMatchForm, setShowMatchForm] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    
    const handleOpenMatchForm = (match = null) => {
        setSelectedMatch(match); // Puede ser null si estás creando un nuevo partido
        setShowMatchForm(true); // Muestra el formulario MatchForm
    };
 
    const handleShowTournamentForm = () => setShowTournamentForm(true); 
 
    const handleUpdateMatch = async (details) => {
        const { partidoId, Goles1, Goles2, Equipo1, Equipo2, Resultado, estado } = details;
        const payload = {
            partidoId,
            goles1: Goles1,  
            goles2: Goles2,  
            equipo1: Equipo1,  
            equipo2: Equipo2,  
            resultado: Resultado, 
            estado
        };
  console.log("payload antes de enviar",payload)
    try {
        const response = await axios.post(apiUrls.actualizarPartido,   payload);
        console.log(response.data);
      
        await fetchAndSetTorneos(); // Actualiza la lista de torneos y partidos
        setShowMatchForm(false); // Cierra el modal después de actualizar
        setShowSuccessMessage(true);
        // Actualizar el estado de la UI según sea necesario
    } catch (error) {
        console.error('Error al actualizar el partido:', error);
    }
};


// Función para finalizar un partido específico
const handleFinalizeMatch = async (partidoId,goles1,goles2,winner) => {
    try {
        const response = await axios.post(apiUrls.finalizarPartido, { partidoId ,goles1,goles2,winner});
        console.log(response.data);
        await fetchAndSetTorneos();
        
        // Actualizar el estado de la UI según sea necesario
    } catch (error) {
        console.error('Error al finalizar el partido:', error);
    }
};



// Función para finalizar un partido específico
const generarNuevaRonda = async (torneoId,ronda) => {
     
    try {
        const response = await axios.post(apiUrls.generarRonda, { torneoId,ronda });
        console.log(response.data);
        await fetchAndSetTorneos();
        
        // Actualizar el estado de la UI según sea necesario
    } catch (error) {
        console.error('Error al generarNuevaRonda:', error);
    }
};

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
        labels: ['Total de torneos', 'Activos', 'Pendientes', 'Cancelados', 'Completados'],
        datasets: [
            {
                label: 'Estado de los torneos',
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

   
    const handleDeleteUser = () => {
        handleDelete(dataUserDelete.Id_usuario);
        setShowDelete(false);
    };


    const [searchTerm, setSearchTerm] = useState('');

 
    const colorEstadoPartido = (status) => {
        switch (status) {
            case 'Activo':
                return { style: { backgroundColor: 'rgba(23, 200, 0, 0.6)', color: 'black' }, text: 'Activo' };
            case 'Pendiente':
                return { style: { backgroundColor: 'rgba(75, 192, 192, 0.6)', color: 'black' }, text: 'Pendiente' };
            case 'Cancelado':
                return { style: { backgroundColor: 'rgba(255, 99, 132, 0.6)', color: 'white' }, text: 'Cancelado' };
                case 'Completado':
                    return { style: { backgroundColor: 'rgba(255, 205, 86, 0.6)', color: 'blue' }, text: 'Completado' };
                    case 'Jugando':
                        return { style: { backgroundColor: 'rgba(0, 205, 86, 0.6)', color: 'white' }, text: 'Completado' };
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
 
    const handleCreateTournament = async (tournamentData) => {
        try {
            // Aquí 'tournamentData' contendrá los datos del formulario: Nombre, Horario, Equipos, Lugar
            if(tournamentData.tipo=='Jornadas')
        {
            const response = await axios.post(apiUrls.generarTorneoJornadas, tournamentData);
            console.log('Torneo creado exitosamente', response.data);
            setShowTournamentForm(false);
            fetchAndSetTorneos(); // Actualiza la lista de torneos
        }
        else
        {
            const response = await axios.post(apiUrls.generarTorneo, tournamentData);
            console.log('Torneo creado exitosamente', response.data);
            setShowTournamentForm(false);
            fetchAndSetTorneos(); // Actualiza la lista de torneos
        }
           
        } catch (error) {
            console.error('Error al crear el torneo:', error);
        }
    };


  
    
    


    return (
        <Container>
        {/* Otros elementos de tu página */}

        {/* Inclusión del Bracket */}
        <Row className="my-4" hidden>
            <Col>
                {tournamentData ? <Bracket tournamentData={tournamentData} /> : 'Cargando datos del torneo...'}    
            </Col>
        </Row>

            <Row className="mb-3">
                <Col>
                    <h4>Gestión de Torneos</h4>
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

            <TournamentForm
                showTournamentForm={showTournamentForm}
                setShowTournamentForm={setShowTournamentForm}
                handleCreateTournament={handleCreateTournament} // Aquí pasamos la función
                handleCreate={handleCreate}
                setUser={setUser}
                user={user}
                clave={clave}
            />

            <MatchForm
                
                showMatchForm={showMatchForm}
                setShowMatchForm={setShowMatchForm}
                selectedMatch={selectedMatch}
                handleFinalizeMatch={handleFinalizeMatch}
                handleUpdateMatch={handleUpdateMatch} 
                // Agrega cualquier otra prop necesaria para crear o editar un partido
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
                <Col md={12} sm={{ order: 1 }} xs={{ order: 2 }}>
                    <Row className="mb-3">
                        <Col md={3} xs={4} className="d-flex align-items-stretch">
                            <Button className='btn-accion' variant="success" onClick={handleShowTournamentForm}>
                                <img src={IconAdd} alt="Nuevo Torneo" /> Nuevo Torneo
                            </Button>
                        </Col>
                      
                    </Row>

                    <Row className="mb-3">
                        <TorneosTable
                            torneos={torneos}
                            partidos={partidos}
                            handleExamStatusFilterChange={handleExamStatusFilterChange}
                            examStatusFilter={examStatusFilter}
                            colorEstadoPartido={colorEstadoPartido}
                            handleOpenMatchForm={handleOpenMatchForm}
                            generarNuevaRonda={generarNuevaRonda}
                            fetchAndSetTorneos={fetchAndSetTorneos}
                        />
                    </Row>

 

                </Col>
                <Col md={4} sm={{ order: 2 }} xs={{ order: 1 }} hidden>
                    <Row className="mb-3">
                        <Col md>
                            {/*
                            <h6>Total de Usuarios: {users.length}</h6>
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

   
 
const TorneosTable = ({ torneos, partidos, handleExamStatusFilterChange, examStatusFilter, colorEstadoPartido,handleOpenMatchForm,generarNuevaRonda,fetchAndSetTorneos  }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedTorneo, setExpandedTorneo] = useState(null);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [showStatsModal2, setShowStatsModal2] = useState(false);
    const [teamStats, setTeamStats] = useState({});

    const fetchTeamStats = async (torneoId) => {
        try {
            const response = await axios.post(apiUrls.consultaEstadisticasEquipos, { torneoId });
            setTeamStats(response.data);
            setShowStatsModal(true);
        } catch (error) {
            console.error('Error fetching team stats:', error);
        }
    };

    const fetchTeamStats2 = async (torneoId) => {
        try {
            const response = await axios.post(apiUrls.consultaEstadisticasEquipos, { torneoId });
            setTeamStats(response.data);
            console.log("setTeamStats",response.data)
            setShowStatsModal2(true);
        } catch (error) {
            console.error('Error fetching team stats:', error);
        }
    };

    const navigate = useNavigate();

    const removePunctuation = (text) => {
        return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    };

    const filteredTorneos = torneos.filter(torneo =>
        (examStatusFilter === '' || torneo.Estado.toString() === examStatusFilter) &&
        removePunctuation(torneo.Nombre).toLowerCase().includes(removePunctuation(searchTerm).toLowerCase())
    );

    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentTorneos = filteredTorneos.slice(firstIndex, lastIndex);

    const totalPages = Math.ceil(filteredTorneos.length / itemsPerPage);

    const handlePageChange = page => setCurrentPage(page);

    const viewResults = (Id_usuario) => {
        localStorage.setItem('ID_results', Id_usuario);
        navigate('/resultados');
    };

    const todosLosPartidosCompletados = (torneoId) => {
        // Asumiendo que `partidos[torneoId]` contiene los partidos del torneo con ese ID
        const partidosDelTorneo = partidos[torneoId] || [];
        return partidosDelTorneo.every(partido => partido.Estado === 'Completado');
    };

    
    const calcularEquiposRestantes = (torneoId) => {
        const partidosDelTorneo = partidos[torneoId] || [];
        const equiposEnLaRonda = new Set();

        partidosDelTorneo.forEach(partido => {
            equiposEnLaRonda.add(partido.Equipo1);
            equiposEnLaRonda.add(partido.Equipo2);
        });

        return equiposEnLaRonda.size;
    };
    const esFinalizableElTorneo = (torneoId) => {
        const partidosDelTorneo = partidos[torneoId] || [];
    
        // Identificar la última ronda
    console.log("partidosDelTorneo",partidosDelTorneo)
    console.log("torneoId",torneoId)
        const ultimaRonda = Math.max(...partidosDelTorneo.map(partido => partido.Ronda));
    console.log("ultimaRonda",ultimaRonda)
        // Filtrar partidos de la última ronda
        const partidosUltimaRonda = partidosDelTorneo.filter(partido => partido.Ronda == ultimaRonda);
        console.log("partidosUltimaRonda",partidosUltimaRonda)
        // Verificar si todos los partidos de la última ronda están completados
        const todosCompletados = partidosUltimaRonda.every(partido => partido.Estado === 'Completado');
    
        // Verificar si la última ronda tiene solo dos equipos (indicando una final)
        const equiposEnFinal = new Set();
        partidosUltimaRonda.forEach(partido => {
            equiposEnFinal.add(partido.Equipo1);
            equiposEnFinal.add(partido.Equipo2);
        });
   
        // Si todos los partidos están completados, solo hay dos equipos, y el torneo NO está ya completado, entonces es finalizable
        return todosCompletados && equiposEnFinal.size === 2  ;
      };

    const todosLosPartidosJornadasCompletados = (torneoId) => {
        const partidosDelTorneo = partidos[torneoId] || [];
        // Filtra solo los partidos de tipo 'Jornadas' y luego verifica si todos están completados
        return partidosDelTorneo.filter(partido => partido.Tipo === 'Jornadas').every(partido => partido.Estado === 'Completado');
    };
    
    const existenPartidosEliminatoria = (torneoId) => {
        const partidosDelTorneo = partidos[torneoId] || [];
        // Verifica si hay al menos un partido de tipo 'Eliminatoria'
        return partidosDelTorneo.some(partido => partido.Tipo === 'Eliminatoria');
    };
    
    const [selectedTeams, setSelectedTeams] = useState(new Set());

const handleCheck = (team) => {
    setSelectedTeams(prev => {
        const newSet = new Set(prev);
        if (newSet.has(team)) {
            newSet.delete(team);
        } else {
            newSet.add(team);
        }
        return newSet;
    });
};

const generarEliminatorias = async (torneoId, equipos) => {
    try {
        // Aquí 'tournamentData' contendrá los datos del formulario: Nombre, Horario, Equipos, Lugar
      console.log("Fase eliminatoria",torneoId, equipos)
        const response = await axios.post(apiUrls.generarFaseEliminatoria, {torneoId:torneoId, equipos:equipos});
        console.log('Fase creado exitosamente', response.data);
       
        await fetchAndSetTorneos(); // Actualiza la lista de torneos
   
       
    } catch (error) {
        console.error('Error al crear el torneo:', error);
    }
};


const finalizarTorneo = async (torneoId) => {
    try {
        const response = await axios.post(apiUrls.finalizarTorneo, { torneoId});
        console.log(response.data);
        await fetchAndSetTorneos();
        
        // Actualizar el estado de la UI según sea necesario
    } catch (error) {
        console.error('Error al finalizar el torneo:', error);
    }
};

function colorTipoPartido(tipo) {
    switch (tipo) {
        case 'Jornadas':
            return { backgroundColor: 'rgba(0, 123, 255, 0.6)', color: 'white' }; // Azul
        case 'Eliminatoria':
            return { backgroundColor: 'rgba(108, 117, 125, 0.6)', color: 'white' }; // Gris
        default:
            return { backgroundColor: 'rgba(108, 117, 125, 0.2)', color: 'black' }; // Gris claro por defecto
    }
}
const eliminarTorneo = async (torneoId) => {
    try {
        // Llamar a tu API para eliminar el torneo
        const response = await axios.post(apiUrls.eliminarTorneo, {torneoId: torneoId  });
        console.log("Torneo eliminado exitosamente", response.data);
        
        // Actualizar la lista de torneos para reflejar la eliminación
        await fetchAndSetTorneos();
    } catch (error) {
        console.error("Error al eliminar el torneo:", error);
    }
};
const cancelarTorneo = async (torneoId) => {
    try {
        // Llamar a tu API para cancelar el torneo
        const response = await axios.post(apiUrls.cancelarTorneo, { torneoId:torneoId });
        console.log("Torneo cancelado exitosamente", response.data);
        
        // Actualizar la lista de torneos para reflejar el cambio
        await fetchAndSetTorneos();
    } catch (error) {
        console.error("Error al cancelar el torneo:", error);
    }
};


    return (
        
        <>
          {/* Modal para mostrar las estadísticas */}
          <Modal show={showStatsModal2} onHide={() => setShowStatsModal2(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Equipos para fase eliminatoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Equipo</th>
                                <th>JJ</th>
                                <th>JG</th>
                                <th>JP</th>
                                <th>JE</th>
                                <th>GF</th>
                                <th>GC</th>
                                <th>DG</th>
                                <th>PTS</th>
                                <th>Pasa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(teamStats).map(([team, stats]) => (
                                <tr key={team}>
                                    <td>{team}</td>
                                    <td>{stats.JJ}</td>
                                    <td>{stats.JG}</td>
                                    <td>{stats.JP}</td>
                                    <td>{stats.JE}</td>
                                    <td>{stats.GF}</td>
                                    <td>{stats.GC}</td>
                                    <td>{stats.DG}</td>
                                    <td>{stats.PTS}</td>
                                    <td>     <Form.Group controlId={`checkbox-${team}`} key={team} className="mb-3">
              <Form.Check 
    type="checkbox"
    
    onChange={() => handleCheck(team)}
    checked={selectedTeams.has(team)}
/>

            </Form.Group></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
   
</Modal.Body>
                <Modal.Footer>
                <Button
    variant="primary"
    onClick={() => {
        console.log("expandedTorneo",expandedTorneo)
        generarEliminatorias(expandedTorneo, Array.from(selectedTeams));
        setShowStatsModal2(false); // Cierra el modal después de seleccionar los equipos
    }}
>
    Generar Fase de Eliminatorias
</Button>

                    <Button variant="secondary" onClick={() => setShowStatsModal2(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

           {/* Modal para mostrar las estadísticas */}
           <Modal show={showStatsModal} onHide={() => setShowStatsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Estadísticas del Torneo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Equipo</th>
                                <th>JJ</th>
                                <th>JG</th>
                                <th>JP</th>
                                <th>JE</th>
                                <th>GF</th>
                                <th>GC</th>
                                <th>DG</th>
                                <th>PTS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(teamStats).map(([team, stats]) => (
                                <tr key={team}>
                                    <td>{team}</td>
                                    <td>{stats.JJ}</td>
                                    <td>{stats.JG}</td>
                                    <td>{stats.JP}</td>
                                    <td>{stats.JE}</td>
                                    <td>{stats.GF}</td>
                                    <td>{stats.GC}</td>
                                    <td>{stats.DG}</td>
                                    <td>{stats.PTS}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowStatsModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Row>
                <Col md={28}>
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
                                <option value="Activo">Activos</option>
                                <option value="Cancelado">Cancelado</option>
                                <option value="Completado">Completado</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Table striped hover responsive>
                        <thead>
                            <tr>
                            <th>ID</th>
                                <th>Estado</th>
                                <th>Nombre</th>
                                <th>Ronda Actual</th>
                                <th>Lugar</th>
                                <th>Horario</th>
                                <th>Fecha</th>  
                                <th colspan='2' >Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTorneos.map((torneo, index) => {
                                const isExpanded = expandedTorneo === torneo.ID;
                                const { style, text } = colorEstadoPartido(torneo.Estado);
                                const botonGenerarRondaHabilitado = todosLosPartidosCompletados(expandedTorneo);
                  const equiposRestantes = calcularEquiposRestantes(expandedTorneo);
                const todosCompletados = todosLosPartidosCompletados(expandedTorneo); // Asegúrate de que esta función esté definida para determinar si todos los partidos están completados
                const finalizable = esFinalizableElTorneo(expandedTorneo);
                const estadoTorneo = torneos.find(torneo => torneo.ID == expandedTorneo)?.Estado;

                                return (
                                    <React.Fragment key={`torneo-${torneo.ID}`}>
                                        <tr  style={{ cursor: 'pointer' }}>
                                        <td>{torneo.ID}</td>
                                        <td style={style}>{text}</td>
                                            <td>{torneo.Nombre}</td>
                                            <td>{torneo.Ronda}</td>
                                            <td>{torneo.Lugar}</td>
                                            <td>{torneo.Horario}</td>
                                            <td>{torneo.Fecha}</td>
                                           {/*   <td>{botonGenerarRondaHabilitado? "Completados" : "Incompleto"}</td> */}
                                            <td>
                                                
                                            <Button key={torneo.ID} onClick={() => fetchTeamStats(torneo.ID)}>
                                                Ver Estadísticas
                                            </Button>
                                            </td>
                                            <td>
                                            <Button key={torneo.ID} onClick={() => setExpandedTorneo(isExpanded ? null : torneo.ID)}>
                                                Ver Partidos
                                            </Button>
                                            </td>
                                            <td>
                                                <Button variant="warning" onClick={() => cancelarTorneo(torneo.ID)}>Cancelar</Button>
                                                <Button variant="danger" onClick={() => eliminarTorneo(torneo.ID)}>Eliminar</Button>
                                            </td>
                                        </tr>
                                        {expandedTorneo === torneo.ID && (
                                        <tr key={`expanded-${torneo.ID}`}>
                                            <td colSpan="4">
                                                <Table striped hover size="sm">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Jornada</th>
                                                           
                                                            <th>Equipo 1</th>
                                                            <th>Equipo 2</th>
                                                            <th>Resultado</th>
                                                            <th>Estado</th>
                                                          
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {partidos[torneo.ID]?.filter(partido => partido.Tipo === 'Jornadas').map((partido, index) => (
      <tr key={`partido-${index}`}>
                                                            <td>{index + 1}</td>
                                                                <td>{partido.Jornada}</td>
                                                               
                                                                <td>{partido.Equipo1}</td>
                                                                <td>{partido.Equipo2}</td>
                                                                <td>{partido.Goles1} - {partido.Goles2}</td>
                                                                <td>{partido.Estado}</td>
                                                                
                                                                <td>
                                                                    <Button variant="secondary" onClick={() => handleOpenMatchForm(partido)}>
                                                                        Editar Partido
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                            
                                                        ))}

                                                          
                                                            <tr>
    <td colSpan="6">
        {todosLosPartidosJornadasCompletados(torneo.ID) && !existenPartidosEliminatoria(torneo.ID) && (
          <Button
          variant="primary"
          onClick={async () => {
              // Suponiendo que `torneo.ID` sea el ID del torneo del cual quieres obtener las estadísticas
              await fetchTeamStats2(torneo.ID); // Esta llamada asume que ajustarás fetchTeamStats para actualizar el estado relacionado con el modal de fase de eliminatorias.
              //setShowStatsModal2(true); // Muestra el modal después de obtener las estadísticas
          }}
      >
          Generar Fase de Eliminatorias
      </Button>
      
        )}

      
    </td>
</tr>

                                                    </tbody>
                                                </Table>

                                                <Table striped hover size="sm">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            
                                                            <th>Ronda</th>
                                                            <th>Equipo 1</th>
                                                            <th>Equipo 2</th>
                                                            <th>Resultado</th>
                                                            <th>Estado</th>
                                                           
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                  
                                                    {partidos[torneo.ID]?.filter(partido => partido.Tipo === 'Eliminatoria').map((partido, index) => {
    // Obtener los estilos basados en el estado y tipo
    const estiloEstado = colorEstadoPartido(partido.Estado);
    const estiloTipo = colorTipoPartido(partido.Tipo);

    return (
        <tr key={`partido-${index}`} style={estiloEstado}>
            <td>{index + 1}</td>
            <td>{partido.Ronda}</td>
            <td>{partido.Equipo1}</td>
            <td>{partido.Equipo2}</td>
            <td>{`${partido.Goles1} - ${partido.Goles2}`}</td>
            {/* Puedes decidir aplicar estiloTipo a esta celda o a cualquier otra */}
            <td style={estiloEstado}>{partido.Estado}</td>
           
            <td>
                <Button variant="secondary" onClick={() => handleOpenMatchForm(partido)}>
                    Editar Partido
                </Button>
            </td>
        </tr>
    );
})}

                                                            <tr>
    <td colSpan="6">
        {todosLosPartidosJornadasCompletados(torneo.ID) && !existenPartidosEliminatoria(torneo.ID) && (
          <Button
          variant="primary"
          onClick={async () => {
              // Suponiendo que `torneo.ID` sea el ID del torneo del cual quieres obtener las estadísticas
              await fetchTeamStats2(torneo.ID); // Esta llamada asume que ajustarás fetchTeamStats para actualizar el estado relacionado con el modal de fase de eliminatorias.
              //setShowStatsModal2(true); // Muestra el modal después de obtener las estadísticas
          }}
      >
          Generar Fase de Eliminatorias
      </Button>
      
        )}

        {todosCompletados && botonGenerarRondaHabilitado && estadoTorneo != 'Completado' && (
            <Button
                variant="primary"
                onClick={() => {
                    if (finalizable) {
                        // Lógica para finalizar el torneo
                        console.log("Finalizar Torneo");
                        finalizarTorneo(torneo.ID);
                    } else {
                        generarNuevaRonda(torneo.ID, torneo.Ronda);
                    }
                }}
            >
                {finalizable ? 'Finalizar Torneo' : 'Generar Nueva Ronda'}
            </Button>
        )}
    </td>
</tr>

                                                    </tbody>
                                                </Table>
                                            </td>
                                        </tr>
                                    )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </Table>
                    {/* Componente de paginación aquí */}
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


export default torneosManageView
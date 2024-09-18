import DashboardView from "./dashboard-view"

const Dashboard = (props) => {

    const { user } = props

    //json de prueba con universidades

    const universidades = [
        {
            nombre: "Universidad de Sonora",
            abreviatura: "UNISON"
        },
        {
            nombre: "Instituto Tecnológico de Sonora",
            abreviatura: "ITSON"
        },
        {
            nombre: "Universidad Kino",
            abreviatura: "UKINO"
        },
        {
            nombre: "Universidad Estatal de Sonora",
            abreviatura: "UES"
        },
        {
            nombre: "Universidad Tecnológica de Hermosillo",
            abreviatura: "UTH"
        },
        {
            nombre: "Universidad del Valle de México",
            abreviatura: "UVM"
        },
        {
            nombre: "Universidad La Salle Noroeste",
            abreviatura: "ULSA"
        },
        {
            nombre: "Universidad TecMilenio",
            abreviatura: "TecMilenio"
        },
        {
            nombre: "Universidad Vizcaya de las Américas",
            abreviatura: "UVA"
        },
        {
            nombre: "Instituto Tecnológico Superior de Cajeme",
            abreviatura: "ITESCA"
        }];

    const carreras = [
        {
            nombre: "Ingeniería en Sistemas Computacionales",
            nivel: "Licenciatura"
        },
        {
            nombre: "Licenciatura en Administración de Empresas",
            nivel: "Licenciatura"
        },
        {
            nombre: "Medicina",
            nivel: "Licenciatura"
        },
        {
            nombre: "Psicología",
            nivel: "Licenciatura"
        },
        {
            nombre: "Arquitectura",
            nivel: "Licenciatura"
        },
        {
            nombre: "Derecho",
            nivel: "Licenciatura"
        },
        {
            nombre: "Contaduría Pública",
            nivel: "Licenciatura"
        },
        {
            nombre: "Ingeniería Civil",
            nivel: "Licenciatura"
        },
        {
            nombre: "Diseño Gráfico",
            nivel: "Licenciatura"
        },
        {
            nombre: "Enfermería",
            nivel: "Licenciatura"
        }
    ];

    return (
        <>

            <DashboardView
                user={user}
                universidades={universidades}
                carreras={carreras}
            />

        </>
    )
}

export default Dashboard

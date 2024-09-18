import CambioContrasena from "../../../components/CambioContrasena"

export const CambioContrasenaView = (props) => {

    const { handlechangePass,newError,success } = props;

    return (
        <>
            <CambioContrasena
                handlechangePass={handlechangePass}
                newError={newError}
                success={success}
            />
        </>
    )
}

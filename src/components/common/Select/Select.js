import { useField } from 'formik';

const CustomSelect = ({...props}) => {
  const [field, meta] = useField(props);

  return(
    <div>
      <label htmlFor={props.id || props.name}></label>
      <select {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  )
}

export default CustomSelect;
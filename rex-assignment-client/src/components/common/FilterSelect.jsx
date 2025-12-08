function FilterSelect({ label, id, value, onChange, options, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label 
        htmlFor={id} 
        className="text-sm font-medium text-sage-700 dark:text-sage-300"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select-field"
        aria-label={label}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FilterSelect


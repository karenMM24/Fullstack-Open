const Filter = ({setFilter}) => {

    const filterChange = (event) => {
    const value = event.target.value
    if(value.length > 0){
        const addFilter = {status:true, filter:value}
        setFilter(addFilter)
        console.log(event.target.value)
        return
    }
    setFilter(false, '')
    }
    return(
    <div>
        filter shown with <input onChange={filterChange}/>
    </div>
    )
}

export default Filter
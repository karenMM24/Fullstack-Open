const Header = (props) => <h2>{props.course}</h2>

const Content = (props) => {
    console.log('props in contesnt', props)
    return (
        <div>
        {props.parts.map(part => 
            <Part key={part.id} part={part}/>
        )}
        <Total parts={props.parts}/>
        </div>
    )
}

const Part = (props) => (
    <p>
    {props.part.name} {props.part.exercises}
    </p>
)

const Total = ({parts}) => {
    console.log('parts ', parts)
    const totalSum = parts.reduce((total, part) => {
        return total + part.exercises
    }, 0)

    return (
        <p><b>total of {totalSum} exercises</b> </p>
    )
}

const Course = (props) => {
    return(
    <div>
        <Header course={props.course.name}/>
        <Content parts={props.course.parts} />
    </div>
    
    )
}

export default Course
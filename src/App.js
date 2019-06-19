import React from 'react';
import './App.css';

function Heading() {return <h1 className="Heading">todos</h1>}

function TodoForm({newTodoFN, toggleAll}) {
  
  function handleSubmit(e) {
    e.preventDefault();
    console.log(e.target.TodoFormTextBox.value);
    newTodoFN(e.target.TodoFormTextBox.value);
    e.target.TodoFormTextBox.value = '';
  }
  
  return (
    <div className="TodoForm">
      <button className="Toggler" onClick={toggleAll}></button>
      <form onSubmit={handleSubmit}>
        <input type="text" className="TodoFormTextBox" name="TodoFormTextBox" placeholder="What needs to be done?" required />
      </form>
    </div>
  );
}

function TodoBox({todo, completed, deleteTodo, todoId, toggleTodo}) {
  const completeStyle = {textDecoration: 'line-through', color: 'grey'};
  return (
    <div className="TodoBox">
      <div className="CheckBox">
        <input 
          type="checkbox" 
          checked={completed ? true : false} 
          onChange={e => toggleTodo(todoId)} 
        />
      </div>
      <p
        style={completed ? completeStyle : null}
      >{todo}</p>
      <button className="Deleter" onClick={e => deleteTodo(todoId)}>X</button>
    </div>
  );
}


function TodoList({todos, toggleTodo, deleteTodo}) {
  const listOfTodos = (
    todos.map(todo =>  (
     <TodoBox
       key={todo.id}
       todoId={todo.id}
       todo={todo.todoItem}
       completed={todo.completed}
       deleteTodo={deleteTodo} 
       toggleTodo={toggleTodo}
     />
    ))
  );
  return (
    listOfTodos
  );
}


function Footer({todos, changeViewFilter}) {
  function handleClick(e) {
    changeViewFilter(e.target.name);
  }
  
  return (
    <div className="Footer">
      <p>{todos.length} {todos.length === 1 ? 'todo' : 'total todos' }</p>
      <button name="SHOW_ALL" onClick={handleClick}>ALL</button>
      <button name="SHOW_ACTIVE" onClick={handleClick}>ACTIVE</button>
      <button name="SHOW_COMPLETED" onClick={handleClick}>COMPLETED</button>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewFilter: 'SHOW_ALL',
      todos: [
        {
          id: 0,
          todoItem: 'Buy biscuits',
          completed: true
        },
        {
          id: 1,
          todoItem: 'Walk the dog',
          completed: false
        },
        {
          id: 2,
          todoItem: 'Watch movie',
          completed: false
        },
        {
          id: 3,
          todoItem: 'Practice web dev',
          completed: true
        },
      ],
      nextId: 4
    };
  }
  
  handleNewTodo = newTodo => {
    console.log(`Added "${newTodo}" to the todo list!`);
    const newTodoObj = {id: this.state.nextId, todoItem: newTodo, completed: false};
    const todos = [...this.state.todos, newTodoObj];
    const newNextId = this.state.nextId + 1;
    const newState = {todos, nextId: newNextId};
    this.setState(newState, () => console.log(this.state));
  }
  
  deleteTodo = todoId => {
    const newTodos = this.state.todos.filter(todo => todo.id !== todoId);
    this.setState({todos: newTodos}, () => console.log('Deleted'));
  }
  
  toggleTodo = todoId => {
    const todos = this.state.todos.map(todo => 
      (todo.id === todoId)
      ? {...todo, completed: !todo.completed}
      : todo
    )
    this.setState({todos}, () => console.log('Toggled'));
  }
  
  toggleAll = () => {
    const allCompleted = this.state.todos.every(todo => todo.completed === true);
    const todos = this.state.todos.map(todo =>
       allCompleted 
         ? {...todo, completed: false} 
         : {...todo, completed: true}
    )
    this.setState({todos}, () => console.log('Toggled All'));
  }
  
  changeViewFilter = viewFilter => {
    this.setState({viewFilter});
  }
  
  render() {
    const {todos, viewFilter} = this.state;
    function visibleTodos(todos, viewFilter) {
      switch (viewFilter) {
        case 'SHOW_ALL':
          return todos;
        case 'SHOW_COMPLETED':
          return todos.filter(todo => todo.completed);
        case 'SHOW_ACTIVE':
          return todos.filter(todo => !todo.completed);
      }
    };
    
    return (
      <div className="App"> 
        <Heading />
        <TodoForm newTodoFN={this.handleNewTodo} toggleAll={this.toggleAll} />   
        <TodoList todos={visibleTodos(todos, viewFilter)} deleteTodo={this.deleteTodo} toggleTodo={this.toggleTodo} />
        {this.state.todos.length !== 0 ? <Footer todos={todos} changeViewFilter={this.changeViewFilter} /> : null}
      </div>
    );
  }
}

export default App;
import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { getTaskMaster } from '../../utils/api';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const apiData = await getTaskMaster();
      if (apiData.error) {
        setError(apiData.error);
      } else {
        // let dataToUpdate = apiData?.data?.filter((data) => {
        //   return data.isActive;
        // });
        setTasks(apiData.data);
      }
    } catch (err) {
      console.log("err", err.name);
      if (err.response) {
        setError(err.response.data.message);
        // setErrorToast(err.response.data.message);
      } else if (err.name === "AxiosError") {
        setError(err.message);
        // setErrorToast(err.message);
      } else {
        setError("something went wrong");
        // setErrorToast("something went wrong");
      }
    }
    setLoading(false);
  }, []);

  // Create a new task
  const createTask = async () => {
    await axios.post('/api/tasks', { title });
    fetchTasks();
    handleClose();
  };

  // Update a task
  const updateTask = async () => {
    await axios.put(`/api/tasks/${taskId}`, { title });
    fetchTasks();
    handleClose();
  };

  // Delete a task
  const deleteTask = async (id) => {
    await axios.delete(`/api/tasks/${id}`);
    fetchTasks();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      updateTask();
    } else {
      createTask();
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setTaskId(task._id);
    setIsEdit(true);
    handleShow();
  };

  const handleAdd = () => {
    setTitle('');
    setIsEdit(false);
    handleShow();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Task Manager</h1>
      <Button onClick={handleAdd}>Add Task</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task._id}>
              <td>{index + 1}</td>
              <td>{task.title}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(task)}>Edit</Button>
                <Button variant="danger" onClick={() => deleteTask(task._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Create/Update */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Task' : 'Add Task'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTaskTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TaskManager;

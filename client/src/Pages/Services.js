import React, { useState } from 'react';
import CreateEmployee from '../Components/CreateEmployee';
import EmployeeDatabase from '../Components/EmployeeDatabase';
import { Button, ButtonGroup } from 'react-bootstrap';

const EmployeeManagement = () => {
  const [activeSection, setActiveSection] = useState('create');

  return (
    <div>
      <ButtonGroup className="mb-3">
        <Button
          variant={activeSection === 'create' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveSection('create')}
        >
          Create Employee
        </Button>
        <Button
          variant={activeSection === 'database' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveSection('database')}
        >
          Employee Database
        </Button>
      </ButtonGroup>

      {activeSection === 'create' && <CreateEmployee />}
      {activeSection === 'database' && <EmployeeDatabase />}
    </div>
  );
};

export default EmployeeManagement;
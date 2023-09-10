import * as React from "react";
import InputMask from 'react-input-mask';
import './App.css';

const request_options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_email: '',
            user_number: '',
            is_data_loading: false
        }

        this.handleEditField = this.handleEditField.bind(this);
        this.handleSearchData = this.handleSearchData.bind(this);

        this.server_path_name = 'http://127.0.0.1:3000';
    }

    handleEditField(field_name, new_value) {
        if (field_name === 'email') {
            this.setState({ user_email: new_value });
        } else if (field_name === 'number') {
            this.setState({ user_number: new_value });
        }
    }

    handleSearchData(e) {
        let { user_email, user_number, is_data_loading } = this.state;
        e.preventDefault();
        if (is_data_loading) return;

        if (!/^.+@\w+\.\w+$/.test(user_email)) return;

        user_number = user_number.replaceAll(/\D+/g, '');
        if (user_number.length !== 0 && user_number.length !== 6) return;

        this.setState({ is_data_loading: true });
        fetch(`${this.server_path_name}/search?email=${user_email}&number=${user_number}`, request_options)
            .then(response => {
                return response.json();
            }).then(data => {
                console.log(data);
                this.setState({ is_data_loading: false });
            });
    }

    render() {
        const { user_email, user_number, is_data_loading } = this.state;

        return (
            <div className="App">
                <header><h2><a href='/'>My App</a></h2></header>
                <main>
                    <form>
                        <h3>Search user</h3>
                        <div className='input_block'>
                            <label>Email: *</label>
                            <input value={user_email} placeholder='email'
                                   onChange={(e) => this.handleEditField('email', e.target.value)}
                            />
                        </div>
                        <div className='input_block'>
                            <label>Number:</label>
                            <InputMask value={user_number} placeholder='number' mask='99-99-99'
                                   onChange={(e) => this.handleEditField('number', e.target.value)}
                            />
                        </div>
                        <button onClick={this.handleSearchData} disabled={is_data_loading}>SUBMIT</button>
                    </form>
                </main>
                <footer>© My app</footer>
            </div>
        );
    }
}

export default App;

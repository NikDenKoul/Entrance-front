import * as React from "react";
import InputMask from 'react-input-mask';
import './App.css';

const request_options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
};

const userCard = function (email, number, key) {
    let formatted_number = `${number}`.split('');
    formatted_number.splice(4,0,'-');
    formatted_number.splice(2,0,'-');
    formatted_number = formatted_number.join('');

    return <div className='user_card' key={key}>
        <div className='user_card__row'>
            <span className='left'>Email:</span>
            <span className='right'>{email}</span>
        </div>
        <div className='user_card__row'>
            <span className='left'>Number:</span>
            <span className='right'>{formatted_number}</span>
        </div>
    </div>;
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_email: '',
            user_number: '',
            loaded_users: [],
            is_data_loading: false,
            is_data_loaded: false,
            email_error: '',
            number_error: ''
        }

        this.handleEditField = this.handleEditField.bind(this);
        this.handleSearchData = this.handleSearchData.bind(this);

        this.server_path_name = 'http://127.0.0.1:3000';
    }

    handleEditField(field_name, new_value) {
        if (field_name === 'email') {
            this.setState({ user_email: new_value, email_error: '' });
        } else if (field_name === 'number') {
            this.setState({ user_number: new_value, number_error: '' });
        }
    }

    handleSearchData(e) {
        let { user_email, user_number, is_data_loading } = this.state;
        e.preventDefault();
        if (is_data_loading) return;

        if (!/^.+@\w+\.\w+$/.test(user_email)) {
            this.setState({ email_error: 'Incorrect email format.' });
            return;
        }

        user_number = user_number.replaceAll(/\D+/g, '');
        if (user_number.length !== 0 && user_number.length !== 6) {
            this.setState({ number_error: 'Number must be empty or full.' });
            return;
        }

        this.setState({ is_data_loading: true });
        fetch(`${this.server_path_name}/search?email=${user_email}&number=${user_number}`, request_options)
            .then(response => {
                return response.json();
            }).then(data => {
                let loaded_users = data.matched_users?.map((item, key) => userCard(item.email, item.number, key));
                this.setState({ is_data_loading: false, is_data_loaded: true, loaded_users: loaded_users });
            });
    }

    render() {
        const {
            user_email, user_number, loaded_users, is_data_loading, is_data_loaded, email_error, number_error
        } = this.state;

        return (
            <div className="App">
                <header><h2><a href='#'>My App</a></h2></header>
                <main>
                    <form>
                        <h3>Search user</h3>
                        <div className='input_block'>
                            <label>Email: *</label>
                            <div className='input_container' data-error={email_error.length > 0}
                                 data-error-message={email_error}
                            >
                                <input value={user_email} placeholder='email'
                                       onChange={(e) => this.handleEditField('email', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='input_block'>
                            <label>Number:</label>
                            <div className='input_container' data-error={number_error.length > 0}
                                 data-error-message={number_error}
                            >
                                <InputMask value={user_number} placeholder='number' mask='99-99-99'
                                       onChange={(e) => this.handleEditField('number', e.target.value)}
                                />
                            </div>
                        </div>
                        <button onClick={this.handleSearchData} disabled={is_data_loading}>SUBMIT</button>
                    </form>
                    {is_data_loaded &&
                        <div className='users_list'>
                            <h3>{loaded_users?.length > 0 ? 'Found users:' : 'Nothing was found.'}</h3>
                            {loaded_users?.length > 0 &&
                                <div className='users_grid'>
                                    {loaded_users}
                                </div>
                            }
                        </div>
                    }
                </main>
                <footer>© My app</footer>
            </div>
        );
    }
}

export default App;

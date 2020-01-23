import axios from 'axios'

export default ( lan ) => {
  if(lan) {
    axios.defaults.headers.common['Accepted-Language'] = lan
  } else {
    delete axios.defaults.headers.common['Accepted-Language']
  }
}

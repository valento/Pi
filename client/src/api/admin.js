import axios from 'axios'

export default {
  locations: {
    addLocation: (data,type) => axios.post('/admin/location/'+type, {data}).then( res => res.data),
    getList: data => axios.get('/admin/location/city', {data}).then( res => console.log((res)))
  }
}

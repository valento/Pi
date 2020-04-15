import axios from 'axios'

export default {
  settup: {
    setUI: () => axios.get('/ui').then( res => res.data ),
    getLocationList: (item,id) => axios.get('/admin/location/'+item+'/'+id).then( res => res.data ),
    getProductList: lan => axios.get('/products/'+lan).then( res => res.data ),
    getLocation: ref => axios.get('/admin/location/ref/'+ref).then( res => res.data ),
    getLocationFac: loc => axios.post('/user/facs', {id:loc}).then( res => res.data )
  },
  user: {
    signup: credentials => axios.post('/auth', { credentials }).then( res => res.data.user ),
    checkOne: () => axios.get('/auth/check').then( res => res.data),
    initUser: () => axios.get('/user').then( res => res.data.user ),
    addLocation: data => axios.post('/user/location', { data }).then( res => {
      console.log(res)
      return res.data.id
    } ),
    updateLocation: (data,id) => axios.post('/user/location/'+id, { data }).then( res => res.data ),
    //locationFac: loc => axios.post('/user/facs', {ids:loc}).then( res => res.data )
  },
  order: {
    pushOrder: data => axios.post('/orders', { data }).then( res => res.data )
  }
}

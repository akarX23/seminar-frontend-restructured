import api from './index';

const createOrder = async(dataToBeSent, cb) => {
    return await api.post('/payments/create_order', dataToBeSent).then((response)=> {
          return cb(response.data)
    }).catch((err) => {
        console.log(err);
        return cb(null);
      });
}

const verifyPayment =async (data, cb)=> {
    return await api.post('/payments/verify', data).then((response)=> {
        if(response.data.success) {
            return cb(response.data)
        } 
        return cb(null)
    }).catch((err) => {
        console.log(err);
        return cb(null);
      });
}

export {createOrder, verifyPayment}
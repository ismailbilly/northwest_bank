const Joi = require('joi')



const updateValidation = (data) => {

  const schema = Joi.object({

      title: Joi.string().required(),
      lastname : Joi.string().required(),
      othernames : Joi.string().required(),
      gender:Joi.string().required(),
      house_number: Joi.string().required(),
      street: Joi.string().required(),
      landmark: Joi.string().required(),
      local_govt: Joi.string().required(),
      dob: Joi.string().required(),
      country: Joi.string().required(),
      state_origin : Joi.string().required(),
      local_govt_origin:Joi.string().required(),
      means_of_id: Joi.string().required(),
      means_of_id_number: Joi.string().required(),
      marital_status : Joi.string().required()


  })

return  schema.validate(data);

}





module.exports = { updateValidation }
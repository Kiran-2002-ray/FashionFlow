const Contact = require('../models/contactModel')

exports.contact = async (req, res) => {
  console.log(req.body);
  try{
  
    await contact.save();
    if(!contact ){
      return res.status(400).json({message: "Failed to save contact" })
    }
    res.status(201).json({message: 'Contact saved successfully'})

  }catch(error){
    console.log(error);
    res.status(500).json({message: 'Error saving contact'})

  }

};

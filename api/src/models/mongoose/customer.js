module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Por favor, rellena el campo "Nombre".'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Por favor, rellena el campo "Email".'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
          validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
          },
          message: 'Debe ser un e-mail válido'
        }
      },
      birthdate: {
        type: Date,
        required: [true, 'Por favor, rellena el campo "Fecha de nacimiento".']
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Customer = mongoose.model('Customer', schema, 'customers')
  return Customer
}

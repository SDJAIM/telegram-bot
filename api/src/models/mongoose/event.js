module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      promoter: { type: String, required: true },
      town: { type: String, required: true },
      spot: { type: String, required: true },
      category: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String },

      prices: [{
        description: { type: String, required: true },
        price: { type: Number, required: true },
        deletedAt: Date,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
      }],

      occurrences: [{
        startDateTime: { type: Date, required: true },
        endDateTime: { type: Date, required: true },
        deletedAt: Date,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
      }],
    },
    { timestamps: true }
  )

  const Event = mongoose.model('Event', schema, 'events')
  return Event
}

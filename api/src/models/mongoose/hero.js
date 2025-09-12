module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String,
      title: String,
      description: String,
      buttonText: String,
      buttonLink: String,
      isActive: {
        type: Boolean,
        default: true
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Hero = mongoose.model('Hero', schema, 'heroes')
  return Hero
}

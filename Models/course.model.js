import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
    },
    thumbnail: {  // Image URL  of the course
      type: String,
      required: true,
    },
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture', // References the Lecture model
      },
    ],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt
);

const Course = mongoose.model('Course', courseSchema);

export default Course;

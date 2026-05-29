// models/Teacher.ts
import mongoose from "mongoose"

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
})

const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema)
export default Teacher
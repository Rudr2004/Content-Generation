import { connectMongo } from '../mongo';
import ServiceTestimonialModel from '../models/serviceTestimonial';
import HirePageTestimonialModel from '../models/hirePageTestimonial';

async function run() {
  await connectMongo();

  // Create service testimonial
  const created = await ServiceTestimonialModel.create({
    serviceId: 999999,
    clientName: 'Test User',
    clientCompany: 'TestCo',
    clientPosition: 'CEO',
    testimonialText: 'This is a test testimonial.',
    rating: 5,
    gender: 'female',
  } as any);

  console.log('Created:', created);

  const found = await ServiceTestimonialModel.find({ serviceId: 999999 }).lean().exec();
  console.log('Found count:', found.length);

  await ServiceTestimonialModel.deleteMany({ serviceId: 999999 }).exec();
  console.log('Cleaned up');

  process.exit(0);
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
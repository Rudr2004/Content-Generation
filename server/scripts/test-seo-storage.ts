import { storage } from '../storage';
import { connectMongo } from '../mongo';

async function run() {
  await connectMongo();

  console.log('Creating test SEO setting...');
  const created = await storage.createSeoSetting({ settingKey: 'migration_test_key', settingValue: 'test_value', description: 'Created by migration test', category: 'test' } as any);
  console.log('Created:', created);

  const fetched = await storage.getSeoSettingByKey('migration_test_key');
  console.log('Fetched by key:', fetched);

  // Clean up
  if (process.env.MONGODB_URI) {
    console.log('Cleaning up test SEO setting...');
    if ((created as any)._id) {
      const id = (created as any)._id.toString();
      try {
        await (await import('../models/seoSetting')).default.findByIdAndDelete(id).exec();
        console.log('Cleanup complete');
      } catch (e) {
        console.warn('Cleanup failed:', e);
      }
    }
  }

  process.exit(0);
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
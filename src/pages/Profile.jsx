import { User } from 'lucide-react';

function Profile() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Profile</h2>
      
      <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-primary-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Your Profile</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Manage your account settings, view your progress, and update your preferences.
        </p>
      </div>
    </div>
  );
}

export default Profile;

import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSubscription } from '@/hooks/use-user-themes';
import { useToast } from '@/hooks/use-toast';

export function ProfileSubscription() {
  const { data: subscription, isLoading } = useSubscription();
  const { toast } = useToast();
  
  const handleManageSubscription = () => {
    toast({
      title: 'Subscription Management',
      description: 'Taking you to subscription management page'
    });
  };
  
  const handleUpgradePlan = () => {
    toast({
      title: 'Upgrade Plan',
      description: 'Taking you to our premium plans'
    });
  };
  
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-5 w-36 bg-gray-700" />
          <Skeleton className="h-5 w-16 bg-gray-700 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full bg-gray-700 mb-3" />
        <Skeleton className="h-9 w-full bg-gray-700 rounded-md" />
      </div>
    );
  }
  
  if (!subscription) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Free Plan</h3>
          <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">BASIC</span>
        </div>
        <p className="text-gray-400 text-sm mt-1 mb-3">
          Upgrade to Premium for unlimited access to all premium themes
        </p>
        <Button 
          className="w-full bg-purple-700 hover:bg-purple-600 text-sm"
          onClick={handleUpgradePlan}
        >
          Upgrade to Premium
        </Button>
      </div>
    );
  }
  
  if (!subscription.isPremium) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Free Plan</h3>
          <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">BASIC</span>
        </div>
        <p className="text-gray-400 text-sm mt-1 mb-3">
          Upgrade to Premium for unlimited access to all premium themes
        </p>
        <Button 
          className="w-full bg-purple-700 hover:bg-purple-600 text-sm"
          onClick={handleUpgradePlan}
        >
          Upgrade to Premium
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Premium Membership</h3>
        <span className="bg-purple-700 text-white text-xs px-2 py-1 rounded-full">ACTIVE</span>
      </div>
      <p className="text-gray-400 text-sm mt-1">
        {subscription.plan && `${subscription.plan} Plan • `}
        {subscription.expiryDate 
          ? `Access until ${new Date(subscription.expiryDate).toLocaleDateString()}`
          : 'Unlimited access to all premium themes'
        }
      </p>
      <Button 
        className="w-full mt-3 bg-purple-700 hover:bg-purple-600 text-sm"
        onClick={handleManageSubscription}
      >
        Manage Subscription
      </Button>
    </div>
  );
}

export default ProfileSubscription;

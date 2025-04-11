import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/user-service';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

// Hook for getting user's favorite themes
export function useFavorites() {
  const { isLoggedIn } = useAuth();
  
  return useQuery({
    queryKey: ['/api/user/favorites'],
    queryFn: userService.getFavorites,
    enabled: isLoggedIn,
  });
}

// Hook for adding a theme to favorites
export function useAddToFavorites() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: userService.addToFavorites,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/user/favorites'] });
      toast({
        title: 'Added to favorites',
        description: 'Theme has been added to your favorites',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to add favorite',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    },
  });
}

// Hook for removing a theme from favorites
export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: userService.removeFromFavorites,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/user/favorites'] });
      toast({
        title: 'Removed from favorites',
        description: 'Theme has been removed from your favorites',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to remove favorite',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    },
  });
}

// Hook for getting user's downloaded themes
export function useDownloads() {
  const { isLoggedIn } = useAuth();
  
  return useQuery({
    queryKey: ['/api/user/downloads'],
    queryFn: userService.getDownloads,
    enabled: isLoggedIn,
  });
}

// Hook for recording a theme download
export function useRecordDownload() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: userService.recordDownload,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/user/downloads'] });
    },
    onError: (error) => {
      console.error('Failed to record download:', error);
    },
  });
}

// Hook for getting user's purchased themes
export function usePurchases() {
  const { isLoggedIn } = useAuth();
  
  return useQuery({
    queryKey: ['/api/user/purchases'],
    queryFn: userService.getPurchases,
    enabled: isLoggedIn,
  });
}

// Hook for purchasing a theme
export function usePurchaseTheme() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: userService.purchaseTheme,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/user/purchases'] });
      toast({
        title: 'Purchase successful',
        description: 'Theme has been added to your library',
      });
    },
    onError: (error) => {
      toast({
        title: 'Purchase failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    },
  });
}

// Hook for getting user's subscription status
export function useSubscription() {
  const { isLoggedIn } = useAuth();
  
  return useQuery({
    queryKey: ['/api/user/subscription'],
    queryFn: userService.getSubscription,
    enabled: isLoggedIn,
  });
}

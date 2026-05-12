'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { supabase } from './supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- AUTHENTICATION ENGINE ---
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const { email, password } = Object.fromEntries(formData);
    
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/adminOfTheAbyss',
    });
    
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error; 
  }
}

// --- ALBUM CREATION AND UDATE ENGINE ---
export async function createAlbum(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const songCount = Number(formData.get('songCount'));
  let status = formData.get('status') as string;
  const coverImage = formData.get('coverImage') as File;
  
  // Platform URLs
  const spotifyUrl = formData.get('spotifyUrl') as string;
  const youtubeUrl = formData.get('youtubeUrl') as string;
  const appleMusicUrl = formData.get('appleMusicUrl') as string;

  // Auto-Date Logic: If left blank, use current date/time
  let releaseDate = formData.get('releaseDate') as string;
  if (!releaseDate) {
    releaseDate = new Date().toISOString();
  }

  if (new Date(releaseDate) > new Date() && status !== 'upcoming') status = 'pending';
  if (status === 'upcoming') await supabase.from('albums').update({ status: 'pending' }).eq('status', 'upcoming');

  let cover_url = null;
  if (coverImage && coverImage.size > 0 && coverImage.name !== 'undefined') {
    const fileName = `${Date.now()}-${coverImage.name.replace(/\s+/g, '-')}`;
    const { error: uploadError } = await supabase.storage.from('covers').upload(fileName, coverImage);
    if (!uploadError) {
      cover_url = supabase.storage.from('covers').getPublicUrl(fileName).data.publicUrl;
    }
  }

  await supabase.from('albums').insert([{ 
    title, description, song_count: songCount, release_date: releaseDate, status, cover_url, 
    spotify_url: spotifyUrl, youtube_url: youtubeUrl, apple_music_url: appleMusicUrl 
  }]);
  
  revalidatePath('/');
  revalidatePath('/albums');
  revalidatePath('/adminOfTheAbyss/albums');
}

export async function updateAlbum(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const songCount = Number(formData.get('songCount'));
  let status = formData.get('status') as string;
  const coverImage = formData.get('coverImage') as File;
  
  // Platform URLs
  const spotifyUrl = formData.get('spotifyUrl') as string;
  const youtubeUrl = formData.get('youtubeUrl') as string;
  const appleMusicUrl = formData.get('appleMusicUrl') as string;

  // Auto-Date Logic: If left blank, use current date/time
  let releaseDate = formData.get('releaseDate') as string;
  if (!releaseDate) {
    releaseDate = new Date().toISOString();
  }

  if (new Date(releaseDate) > new Date() && status !== 'upcoming') status = 'pending';
  if (status === 'upcoming') await supabase.from('albums').update({ status: 'pending' }).eq('status', 'upcoming');

  const updateData: any = { 
    title, description, song_count: songCount, release_date: releaseDate, status, 
    spotify_url: spotifyUrl, youtube_url: youtubeUrl, apple_music_url: appleMusicUrl 
  };

  if (coverImage && coverImage.size > 0 && coverImage.name !== 'undefined') {
    const fileName = `${Date.now()}-${coverImage.name.replace(/\s+/g, '-')}`;
    const { error: uploadError } = await supabase.storage.from('covers').upload(fileName, coverImage);
    if (!uploadError) {
      updateData.cover_url = supabase.storage.from('covers').getPublicUrl(fileName).data.publicUrl;
    }
  }

  await supabase.from('albums').update(updateData).eq('id', id);
  revalidatePath('/');
  revalidatePath('/albums');
  revalidatePath('/adminOfTheAbyss/albums');
}

export async function deleteAlbums(ids: string[]) {
  // 1. Fetch the cover URLs before deleting the row
  const { data: albums } = await supabase.from('albums').select('cover_url').in('id', ids);
  
  // 2. Delete the actual image files from the 'covers' bucket
  if (albums && albums.length > 0) {
    const fileNames = albums
      .map(a => a.cover_url)
      .filter(url => url !== null) 
      .map(url => {
        const parts = url.split('/');
        return parts[parts.length - 1]; // Extract filename
      });
      
    if (fileNames.length > 0) {
      await supabase.storage.from('covers').remove(fileNames);
    }
  }

  // 3. Delete the rows
  await supabase.from('albums').delete().in('id', ids);
  
  revalidatePath('/');
  revalidatePath('/albums');
  revalidatePath('/adminOfTheAbyss/albums');
}

// --- LOGOUT ENGINE ---
import { signOut as authSignOut } from '@/auth';

export async function logout() {
  await authSignOut({ redirectTo: '/' });
}

// --- Auto Release Album
export async function autoReleaseAlbum(id: string) {
  // Now transitions to 'newly released' instead of 'released'
  await supabase.from('albums').update({ status: 'newly released' }).eq('id', id);
  revalidatePath('/');
  revalidatePath('/albums');
}

// --- GALLERY ACTIONS ---
export async function uploadGalleryImages(formData: FormData) {
  const files = formData.getAll('images') as File[]; 
  // Get the title and trim whitespace immediately
  const rawTitle = formData.get('title') as string;
  const userTitle = rawTitle?.trim();

  for (const image of files) {
    if (!image || image.size === 0) continue;

    // Standard filename preparation for Storage
    const storageFileName = `${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
    const { error: uploadError } = await supabase.storage.from('gallery').upload(storageFileName, image);

    if (!uploadError) {
      const imageUrl = supabase.storage.from('gallery').getPublicUrl(storageFileName).data.publicUrl;
      
      // LOGIC FIX: 
      // 1. If userTitle exists and isn't an empty string, use it.
      // 2. Otherwise, take image.name (e.g., "photo.jpg")
      // 3. Remove the extension (e.g., "photo")
      // 4. Replace underscores/dashes with spaces for better readability
      const fallbackName = image.name
        .replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/[_-]/g, " ");   // Optional: make "my-photo" look like "my photo"

      const finalTitle = userTitle || fallbackName;
      
      await supabase.from('gallery').insert([{ 
        title: finalTitle, 
        image_url: imageUrl 
      }]);
    }
  }

  revalidatePath('/gallery');
  revalidatePath('/adminOfTheAbyss/gallery');
}

export async function deleteGalleryImages(ids: string[]) {
  const { data: images } = await supabase.from('gallery').select('image_url').in('id', ids);
  if (images && images.length > 0) {
    const fileNames = images.map(img => img.image_url.split('/').pop());
    await supabase.storage.from('gallery').remove(fileNames as string[]);
  }
  await supabase.from('gallery').delete().in('id', ids);
  revalidatePath('/gallery');
  revalidatePath('/adminOfTheAbyss/gallery');
}

// --- STORAGE MANAGER ACTIONS ---
export async function deleteStorageFiles(bucket: string, fileNames: string[]) {
  await supabase.storage.from(bucket).remove(fileNames);
  revalidatePath('/adminOfTheAbyss/storage');
}

// --- ANNOUNCEMENT ACTIONS ---
export async function upsertAnnouncement(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const priority = formData.get('priority') as string;
  const expires_at = formData.get('expires_at') as string;
  const is_active = formData.get('is_active') === 'true';

  const data = {
    title,
    content,
    priority,
    expires_at: expires_at || null,
    is_active
  };

  if (id) {
    await supabase.from('announcements').update(data).eq('id', id);
  } else {
    await supabase.from('announcements').insert([data]);
  }

  revalidatePath('/');
  revalidatePath('/announcements');
  revalidatePath('/adminOfTheAbyss/announcements');
}

export async function deleteAnnouncements(ids: string[]) {
  await supabase.from('announcements').delete().in('id', ids);
  revalidatePath('/');
  revalidatePath('/announcements');
  revalidatePath('/adminOfTheAbyss/announcements');
}
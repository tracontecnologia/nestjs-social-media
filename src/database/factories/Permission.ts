export function getManyPermissions() {
  return [
    { name: 'create_user' },
    { name: 'read_user' },
    { name: 'updated_user' },
    { name: 'delete_user' },
    { name: 'follow_user' },

    { name: 'create_post' },
    { name: 'read_post' },
    { name: 'updated_post' },
    { name: 'delete_post' },
    { name: 'like_post' },

    { name: 'create_photo' },
    { name: 'read_photo' },
    { name: 'updated_photo' },
    { name: 'delete_photo' },
  ];
}

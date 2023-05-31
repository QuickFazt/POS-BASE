service cloud.firestore {

match /databases/{database}/documents{

function isAuthenticated(){
return request.auth.uid !=null;
}

function isAdmin() {
return isAuthenticated() &&
       get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role == 'admin';
}

function isKnownUser(){
return isAuthenticated() &&
exists(/databases/$(database)/documents/users/$(request.auth.uid));
}


function isOwner(userId){
  return request.auth.uid == userId
}

match /counters/{counterId}{
allow create, update, read: if isKnownUser();
}

match /users/{userId}{
allow create, update: if isAdmin();
allow read: if isKnownUser();
}

match /roles/{roleId} {
allow create, update: if isAdmin();
allow read: if isKnownUser();
}

match /tax/{taxId}{
allow create, update: if isAdmin();
allow read: if isKnownUser();
}

match /clients/{clientId}{
allow create, read: if isKnownUser();
}

match /currency/{currencyId}{
allow create, update, delete: if isAdmin();
allow read: if isKnownUser();
}

match /products/{productId} {
allow create, delete: if isAdmin();
allow update, read: if isKnownUser(); 
}

match /categories/{categoryId} {
allow create, update, delete: if isAdmin();
allow read: if isKnownUser(); 
}

match /sales/{saleId} {
allow read: if isAdmin();
allow create: if isKnownUser();
}

match /poss/{posId} {
allow create, update: if isAdmin();
allow read: if isKnownUser();
}

match /pos_openings/{pos_openingId} {
allow create: if isAdmin();
allow update, read: if isKnownUser();
}

}

}
/// Review Registry Smart Contract
/// This module provides functionality to store and verify legal review records on the Aptos blockchain
module review_registry::ReviewRegistry {
    use std::signer;
    use std::vector;
    use std::string::{Self, String};
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_std::table::{Self, Table};

    /// Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_NOT_AUTHOR: u64 = 3;
    const E_REVIEW_NOT_FOUND: u64 = 4;
    const E_INVALID_CONTENT: u64 = 5;

    /// Review status constants
    const STATUS_ACTIVE: u8 = 1;
    const STATUS_UPDATED: u8 = 2;
    const STATUS_DELETED: u8 = 3;

    /// Review record structure
    struct ReviewRecord has store {
        id: String,
        author: address,
        content_hash: String,
        category: String,
        created_at: u64,
        updated_at: u64,
        status: u8,
        metadata: String, // JSON string for additional metadata
    }

    /// Registry resource that stores all reviews
    struct ReviewRegistry has key {
        reviews: Table<String, ReviewRecord>,
        review_count: u64,
    }

    /// Events
    struct ReviewCreatedEvent has drop, store {
        review_id: String,
        author: address,
        content_hash: String,
        category: String,
        timestamp: u64,
    }

    struct ReviewUpdatedEvent has drop, store {
        review_id: String,
        author: address,
        old_content_hash: String,
        new_content_hash: String,
        timestamp: u64,
    }

    struct ReviewDeletedEvent has drop, store {
        review_id: String,
        author: address,
        timestamp: u64,
    }

    /// Initialize the review registry for an account
    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        assert!(!exists<ReviewRegistry>(account_addr), E_ALREADY_INITIALIZED);
        
        let registry = ReviewRegistry {
            reviews: table::new(),
            review_count: 0,
        };
        
        move_to(account, registry);
    }

    /// Create a new review record
    public entry fun create_review(
        account: &signer,
        review_id: String,
        content_hash: String,
        category: String,
        metadata: String,
    ) acquires ReviewRegistry {
        let account_addr = signer::address_of(account);
        
        // Ensure registry is initialized
        if (!exists<ReviewRegistry>(account_addr)) {
            initialize(account);
        };
        
        let registry = borrow_global_mut<ReviewRegistry>(account_addr);
        
        // Validate inputs
        assert!(!string::is_empty(&content_hash), E_INVALID_CONTENT);
        assert!(!table::contains(&registry.reviews, review_id), E_REVIEW_NOT_FOUND);
        
        let now = timestamp::now_microseconds();
        
        let review = ReviewRecord {
            id: review_id,
            author: account_addr,
            content_hash,
            category,
            created_at: now,
            updated_at: now,
            status: STATUS_ACTIVE,
            metadata,
        };
        
        table::add(&mut registry.reviews, review_id, review);
        registry.review_count = registry.review_count + 1;
        
        // Emit event
        event::emit(ReviewCreatedEvent {
            review_id,
            author: account_addr,
            content_hash,
            category,
            timestamp: now,
        });
    }

    /// Update an existing review record
    public entry fun update_review(
        account: &signer,
        review_id: String,
        new_content_hash: String,
        new_metadata: String,
    ) acquires ReviewRegistry {
        let account_addr = signer::address_of(account);
        assert!(exists<ReviewRegistry>(account_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global_mut<ReviewRegistry>(account_addr);
        assert!(table::contains(&registry.reviews, review_id), E_REVIEW_NOT_FOUND);
        
        let review = table::borrow_mut(&mut registry.reviews, review_id);
        assert!(review.author == account_addr, E_NOT_AUTHOR);
        
        let old_content_hash = review.content_hash;
        let now = timestamp::now_microseconds();
        
        review.content_hash = new_content_hash;
        review.metadata = new_metadata;
        review.updated_at = now;
        review.status = STATUS_UPDATED;
        
        // Emit event
        event::emit(ReviewUpdatedEvent {
            review_id,
            author: account_addr,
            old_content_hash,
            new_content_hash,
            timestamp: now,
        });
    }

    /// Soft delete a review record (marks as deleted but keeps data)
    public entry fun delete_review(
        account: &signer,
        review_id: String,
    ) acquires ReviewRegistry {
        let account_addr = signer::address_of(account);
        assert!(exists<ReviewRegistry>(account_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global_mut<ReviewRegistry>(account_addr);
        assert!(table::contains(&registry.reviews, review_id), E_REVIEW_NOT_FOUND);
        
        let review = table::borrow_mut(&mut registry.reviews, review_id);
        assert!(review.author == account_addr, E_NOT_AUTHOR);
        
        let now = timestamp::now_microseconds();
        review.status = STATUS_DELETED;
        review.updated_at = now;
        
        // Emit event
        event::emit(ReviewDeletedEvent {
            review_id,
            author: account_addr,
            timestamp: now,
        });
    }

    /// Get a review record by ID
    #[view]
    public fun get_review(account_addr: address, review_id: String): (String, address, String, String, u64, u64, u8, String) acquires ReviewRegistry {
        assert!(exists<ReviewRegistry>(account_addr), E_NOT_INITIALIZED);
        
        let registry = borrow_global<ReviewRegistry>(account_addr);
        assert!(table::contains(&registry.reviews, review_id), E_REVIEW_NOT_FOUND);
        
        let review = table::borrow(&registry.reviews, review_id);
        (
            review.id,
            review.author,
            review.content_hash,
            review.category,
            review.created_at,
            review.updated_at,
            review.status,
            review.metadata
        )
    }

    /// Check if a review exists
    #[view]
    public fun review_exists(account_addr: address, review_id: String): bool acquires ReviewRegistry {
        if (!exists<ReviewRegistry>(account_addr)) {
            return false
        };
        
        let registry = borrow_global<ReviewRegistry>(account_addr);
        table::contains(&registry.reviews, review_id)
    }

    /// Get the total number of reviews for an account
    #[view]
    public fun get_review_count(account_addr: address): u64 acquires ReviewRegistry {
        if (!exists<ReviewRegistry>(account_addr)) {
            return 0
        };
        
        let registry = borrow_global<ReviewRegistry>(account_addr);
        registry.review_count
    }

    /// Verify that a content hash matches a stored review
    #[view]
    public fun verify_content_hash(account_addr: address, review_id: String, content_hash: String): bool acquires ReviewRegistry {
        if (!exists<ReviewRegistry>(account_addr)) {
            return false
        };
        
        let registry = borrow_global<ReviewRegistry>(account_addr);
        if (!table::contains(&registry.reviews, review_id)) {
            return false
        };
        
        let review = table::borrow(&registry.reviews, review_id);
        review.content_hash == content_hash && review.status != STATUS_DELETED
    }
}
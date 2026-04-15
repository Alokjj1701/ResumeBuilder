package com.resumebuilder.repository;

import com.resumebuilder.entity.OtpToken;
import com.resumebuilder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, UUID> {

    // Latest active (not used) OTP for a user + purpose
    Optional<OtpToken> findFirstByUserAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(
            User user, String purpose);

    // Invalidate all active OTPs for a user + purpose before sending a new one
    @Modifying
    @Query("UPDATE OtpToken o SET o.isUsed = true WHERE o.user = :user AND o.purpose = :purpose AND o.isUsed = false")
    void invalidateAllByUserAndPurpose(User user, String purpose);
}

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Plus, Edit3, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { MappingCategory, MappingItem } from '@/utils/mappingStorage';

interface CategoryCardProps {
  category: MappingCategory;
  onAddItem: (categoryId: string) => void;
  onEditItem: (categoryId: string, item: MappingItem) => void;
  onDeleteItem: (categoryId: string, itemId: string) => void;
}

export default function CategoryCard({
  category,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: CategoryCardProps) {
  const total = category.items.reduce((sum, item) => sum + item.amount, 0);
  const isAsset = category.type === 'asset';

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={[styles.total, isAsset ? styles.assetTotal : styles.liabilityTotal]}>
            {formatCurrency(total)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddItem(category.id)}
        >
          <Plus size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {category.items.length > 0 && (
        <View style={styles.itemsList}>
          {category.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                {item.accountType && (
                  <Text style={styles.itemAccountType}>{item.accountType}</Text>
                )}
                {item.notes && (
                  <Text style={styles.itemNotes}>{item.notes}</Text>
                )}
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemAmount}>
                  {formatCurrency(item.amount)}
                </Text>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onEditItem(category.id, item)}
                  >
                    <Edit3 size={14} color={Colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onDeleteItem(category.id, item.id)}
                  >
                    <Trash2 size={14} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {category.items.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No items added yet</Text>
          <TouchableOpacity
            style={styles.emptyAddButton}
            onPress={() => onAddItem(category.id)}
          >
            <Text style={styles.emptyAddText}>Add your first item</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  total: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  assetTotal: {
    color: Colors.success,
  },
  liabilityTotal: {
    color: Colors.error,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentLight,
    borderWidth: 1,
    borderColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  itemsList: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 2,
  },
  itemAccountType: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  itemNotes: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  emptyAddButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.accentLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  emptyAddText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});